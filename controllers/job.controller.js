import {TryCatch} from '../middlewares/error.js'
import { Job } from '../models/job.models.js';

export const postJob = TryCatch(async (req,res) => {
    const {title,description,requirements,salary,location,jobType,experience,position,companyId} = req.body
    const userId = req.id;

    if(!title || !description||!requirements||!salary||!location||!jobType||!experience||!position||!companyId){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        })
    }
    const job = await Job.create({
        title,
        description,
        requirements:requirements.split(","),
        salary,
        location,
        jobType,
        experienceLevel:experience,
        position,
        company:companyId,
        created_by:userId
    })

    return res.status(201).json({
        message:"New Job Successfully Created",
        job,
        success:true
    })
})

export const getAllJobs = TryCatch(async (req,res) => {
    const keyword = req.query.keyword || "";
    const query = {
        $or:[
            {title:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}},
        ]
    }

    const jobs = await Job.find(query).populate("company").sort({createdAt:-1});
    if(!jobs) {
        return res.status(400).json({
            message:"Jobs not Found !",
            success:false
        })
    }

    return res.status(200).json({
        jobs,
        success:true
    })
})

export const getJobsById = TryCatch(async (req,res) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if(!job) {
        return res.status(400).json({
            message:"Job not Found !",
            success:false
        })
    }

    return res.status(200).json({
        job,
        success:true
    })
})
//admin dashboard api
export const getAdminJob = TryCatch(async(req,res) => {
    const adminId = req.id;

    const jobs = await Job.find({created_by:adminId})
    if(!jobs) {
        return res.status(400).json({
            message:"Jobs not found",
            success:false
        })
    }
    return res.status(200).json({
        jobs,
        success:false
    })

})