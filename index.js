import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/database.js';
import userRoute from './routes/user.routes.js'
import companyRoute from './routes/company.routes.js'
import jobRoute from './routes/jobs.routes.js'
import applicationRoute from './routes/application.routes.js'


dotenv.config({})
connectDB()
const app = express();
//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const corsOptions = {
    origin:'https://job-portal-frontend-ochre.vercel.app',
    credentials:true
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000;

//API ROUTES
app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationRoute)

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`)
})