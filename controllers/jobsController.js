import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError,NotFoundError,UnAuthenticatedError } from '../errors/index.js'
import CheckPremissions from '../utils/CheckPremissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createJob = async (req,res) => {
    const { position, company } = req.body

    if(!position || !company ){
        throw new BadRequestError('Please provide all values')
    }

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const getAllJobs = async (req,res) => {
    const { status, jobType, sort, search } = req.query

    const queryObject = {
        createdBy:req.user.userId
    }
    // const jobs = await Job.find({createdBy:req.user.userId})

    
    //add stuff based on condition
    if(status && status !== 'all'){ //add it to query object
        queryObject.status = status
    }
    if (jobType !== 'all') {
        queryObject.jobType = jobType;
      }
    if(search){
        queryObject.position = {$regex: search, $options:'i'} 
    }
    //NO AWAIT for sorting
    let result =  Job.find(queryObject) 
    if(sort === 'latest'){
        result = result.sort('-createdAt')
    }
    if(sort === 'oldest'){
        result = result.sort('createdAt')
    }
    if(sort === 'a-z'){
        result = result.sort('position')
    }
    if(sort === 'z-a'){
        result = result.sort('-position')
    }
    
    // setup pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.page) || 10
    const skip = (page-1) * limit
    result = result.skip(skip).limit(limit)
    //75
    //10 10 10 10 10 10 5
    const jobs = await result

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs/limit)

    res
    .status(StatusCodes.OK)
    .json({jobs, totalJobs:jobs.length, numOfPages})
    // res.send('get all jobs')
}
const updateJob = async (req,res) => {
    const { id: JobId } = req.params

    const { company, position } = req.body

    if(!company || !position){
        throw new BadRequestError('Please provide all Values.')
    }
    
    const job = await Job.findOne({_id:JobId})
    if(!job){
        throw new NotFoundError(`No job with id ${JobId}.`)
    }

    // check premission
    CheckPremissions(req.user,job.createdBy)
    const updateJob = await Job.findOneAndUpdate({_id:JobId},req.body,{
        new:true,
        runValidators:true,
    })
    
    res.status(StatusCodes.OK).json({updateJob})
    // res.send('update job')
}
const deleteJob = async (req,res) => {
    const { id: JobId } = req.params

    const job = await Job.findOne({_id:JobId})
    if(!job){
        throw new NotFoundError(`No job with id ${JobId}.`)
    }
    CheckPremissions(req.user,job.createdBy)
    await job.remove()
    res.status(StatusCodes.OK).json({msg:`Success! Job removed`})
    //message won't show on front end
    // res.send('delete job')
}
const showStats = async (req,res) => {
    let stats = await Job.aggregate([
        { $match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
        { $group: {_id: '$status',count: {$sum: 1}}
    }
    ])
    //not return status as array , instead return as object, and each status property value equal to count 
    // status as object easier in front-end

    stats = stats.reduce((acc,curr)=> {
        const {_id: title,count} = curr
        acc[title] = count
        return acc
    },{})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }

    let monthlyApplications = await Job.aggregate([
        {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}}, // get all jobs belong to user
        { $group:{
            _id:{year:{$year:'$createdAt'},month:{$month:'$createdAt'} }, 
        count:{$sum:1},
    },
    },
    {$sort:{'_id.year':-1, '_id.month':-1}}, //get latest value
    {$limit:6}
    ])

    monthlyApplications = monthlyApplications.map((item)=>{
        const {_id:{year,month},count } = item
        const date = moment().month(month-1).year(year).format('MMM Y') // 1-12  
        return {date,count}

    }).reverse() //from oldest to newest
    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications})
}
export { createJob, getAllJobs, showStats, deleteJob, updateJob }