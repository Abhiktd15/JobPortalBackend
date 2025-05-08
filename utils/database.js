import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{dbName:"JobPortal"})
        console.log('Database connected Successfully')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;