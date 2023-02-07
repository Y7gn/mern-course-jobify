import mongoose from 'mongoose'
mongoose.set('strictQuery', false);
// returns promise so use await async
const connectDB = (url) =>{
    return mongoose.connect(url)
}

export default connectDB