import React, { useReducer, useContext, useEffect } from 'react'
import reducer from './reducer'
import { 
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,UPDATE_USER_BEGIN
    ,UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    CLEAR_VALUES ,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE,
    GET_CURRENT_USER_BEGIN,
    GET_CURRENT_USER_SUCCESS,

} from "./actions";
import axios from 'axios'

// const token = localStorage.getItem('token')
// const user = localStorage.getItem('user')
// const userLocation = localStorage.getItem('location')

const initialState = {
    userLoading: true,
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: null,
    // user:user? JSON.parse(user) : null,
    // token:token,
    userLocation: '',
    // userLocation: userLocation || '',
    showSideBar: false,
    isEditing:false,
    editJobId:"",
    position:"",
    company:"",
    jobLocation: '',
    // jobLocation:userLocation || '',
    jobTypeOptions:['full-time', 'part-time', 'remote', 'internship'],
    jobType:'full-time',
    statusOptions: ['interview', 'declined', 'pending'],
    status:"pending",
    jobs:[],
    totalJobs:0,
    numOfPages:1,
    page:1,
    stats:{},
    monthlyApplications:[],
    //search
    search:'',
    searchStatus:'all',
    searchType: 'all',
    sort:'latest',
    sortOptions:['latest','oldest',"a-z","z-a"],
}

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    const [state, dispatch ] = useReducer(reducer,initialState)

    //axios for global to send with every request
    // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`

    // just fetch for address starting at /api/v1
    const authFetch = axios.create({
        baseURL:'/api/v1',
        // headers:{
        //     Authorization: `Bearer ${state.token}`
        // }
    })

    // ################## token ###################
// response interceptor
// authFetch.interceptors.request.use(
//   (config) => {
//     config.headers['Authorization'] = `Bearer ${state.token}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// response interceptor
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //   console.log(error.response);
    if (error.response.status === 401) {
        logoutUser()
    // console.log();
    }
    return Promise.reject(error);
  }
);

    
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(()=>{
            dispatch({ type: CLEAR_ALERT})
        },3000)
    }
    // const addUserToLocalStorage = ({ user, token, location }) => {
    //     localStorage.setItem('user',JSON.stringify(user))
    //     localStorage.setItem('token',token)
    //     localStorage.setItem('location',location)
    // }

    // const removeUserFromLocalStorage = () => {
    //     localStorage.removeItem('user')
    //     localStorage.removeItem('token')
    //     localStorage.removeItem('location')
    // }

    const registerUser= async(currentUser)=>{
        // console.log(currentUser);
        dispatch({type:REGISTER_USER_BEGIN})
        try{
            const response = await axios.post('/api/v1/auth/register',currentUser)
            // console.log(response);
            //token here
            const { user,location } = response.data
            dispatch({type:REGISTER_USER_SUCCESS,payload:{user, location}})
            // addUserToLocalStorage({user,token,location})
        }
        //local storage later
        catch(error){
            // console.log(error.response);
            dispatch({type:REGISTER_USER_ERROR,payload:{msg:error.response.data.msg}})
        }
        clearAlert()
    }   

    const loginUser = async (currentUser) => {
        dispatch({type:LOGIN_USER_BEGIN})
        try{
            const {data} = await axios.post('/api/v1/auth/login',currentUser)
            // console.log(response);

            //add token line 163 and 164
            const { user,location } = data
            dispatch({type:LOGIN_USER_SUCCESS,payload:{user, location}})
            // addUserToLocalStorage({user,token,location})
        }
        //local storage later
        catch(error){
            // console.log(error.response);
            dispatch({type:LOGIN_USER_ERROR,payload:{msg:error.response.data.msg}})
        }
        clearAlert()
    }

    const ToggleSideBar = () => {
        dispatch({ type:TOGGLE_SIDEBAR})
    }
    const logoutUser = async () => {
        await authFetch.get('/auth/logout')
        dispatch({ type:LOGOUT_USER})
        // removeUserFromLocalStorage()
    }

    const updateUser =  async (currentUser) => { //we still have add job update ..etc so let's use global setup
        dispatch({ type: UPDATE_USER_BEGIN})
        try {
            // console.log("started here");
            const { data } =await authFetch.patch('/auth/updateUser',
            currentUser
            // {
            //     headers:{
            //         Authorization:`Bearer ${state.token}`,
            //     },
            // }
            )
            const { user,location } = data
            dispatch({type:UPDATE_USER_SUCCESS,payload:{user,location}})
            // addUserToLocalStorage({ user, location, token})
            // console.log(data);
        } catch (error) {
            // console.log(error.response);
            if(error.response.status !== 401){
                dispatch({type:UPDATE_USER_ERROR,
                    payload:{ msg: error.response.data.msg}})
            }   
            clearAlert()

            }
    }


    const handleChange = ({name, value}) => {
        dispatch({type:"HANDLE_CHANGE",payload:{name,value}})
    }

    const clearValues = () => {
        dispatch({type:CLEAR_VALUES})
    }

    const createJob = async () => {
        dispatch({type:CREATE_JOB_BEGIN})
        try {
            const {position, company,jobLocation, jobType, status } = state
            await authFetch.post('/jobs',{
                position, 
                company,
                jobLocation, 
                jobType, 
                status,
            })
            dispatch({type: CREATE_JOB_SUCCESS})
            dispatch({type:CLEAR_VALUES})
        } catch (error) {
            if(error.response.status === 401 ) return 
            dispatch({type: CREATE_JOB_ERROR,payload:{msg:error.response.data.msg}})
        }
    }

    const getJobs = async () => {
        const { page, search, searchStatus, searchType, sort } = state
        // console.log(search, searchStatus, searchType, sort);
        let url = `/jobs?page=${page}status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if(search){
            url = url + `&search=${search}`
        }

        dispatch({type:GET_JOBS_BEGIN})
        try {
            const {data} = await authFetch(url)
            const {jobs,totalJobs,numOfPages} = data
            dispatch({
                type:GET_JOBS_SUCCESS,
                payload:{
                jobs,
                totalJobs,
                numOfPages,
            }})
        } catch (error) {
            // console.log(error);
            logoutUser()
        }
        clearAlert()
    }
    
    const setEditJob = (id) => {
        // console.log(`set edit job ${id}`);
        dispatch({type:SET_EDIT_JOB,payload:{id}}) 
    }

    const editJob = async () => {
        dispatch({type: EDIT_JOB_BEGIN})
        try {
            const {position,company,jobLocation,jobType,status} = state
            await authFetch.patch(`/jobs/${state.editJobId}`,{
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
        dispatch({type: EDIT_JOB_SUCCESS})
        dispatch({type: CLEAR_VALUES})
    } catch (error) {
        if(error.response.status === 401 ) return
        dispatch({type: EDIT_JOB_ERROR,payload:{msg:error.response.data.msg}})
        
        }
    }
    const deleteJob = async (jobId) => {
        dispatch({type:DELETE_JOB_BEGIN})
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (error) {
            // console.log(error.response);
            logoutUser()
        }
        // console.log(`set edit job ${id}`);
    }
    const showStats = async() => {
        dispatch({type:SHOW_STATS_BEGIN})
        try {
            //by default authFetch will be get request if not specified
            const {data} = await authFetch('/jobs/stats')
            dispatch({type:SHOW_STATS_SUCCESS,payload:{
                stats:data.defaultStats,
                monthlyApplications: data.monthlyApplications,
            }})
        } catch (error) {
            // console.log(error.response);
            logoutUser()
        }
    }

    const clearFilters = () => {
        dispatch({type:CLEAR_FILTERS})
    }

    const changePage = (page) =>{
        dispatch({type:CHANGE_PAGE,payload:{page}})
    }
    const getCurrentUser = async() => {
        dispatch({type:GET_CURRENT_USER_BEGIN})
        try{
            const {data} = await authFetch('/auth/getCurrentUser')
            const { user,location } = data
            dispatch({type:GET_CURRENT_USER_SUCCESS,payload:{user,location}})

        }catch(error){
            if(error.response.status === 401 ) return;
            logoutUser()
        }
    }

    useEffect(()=>{
        getCurrentUser();
    },[])
    
    return (
    <AppContext.Provider value={{...state, 
        displayAlert, 
        registerUser, 
        loginUser,
        ToggleSideBar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        getCurrentUser,
    }}>
        {children}
    </AppContext.Provider>
    )

} 


const useAppContext = () => {
    return useContext(AppContext)
}
//export initial state and then setup the hook
//why hook? 
export {AppProvider,initialState,useAppContext}
