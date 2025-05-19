import {TryCatch } from '../middlewares/error.js'
import { Application } from '../models/application.models.js';
import { Job } from '../models/job.models.js';

export const applyJob = TryCatch(async(req,res) => {
    const userId = req.id;
    const jobId = req.params.id
    if(!jobId) {
        return res.status(400).json({
            message:"JOB id is requried",
            success:false
        })
    }
    //check if the user has already applied or not 
    const existingApplication = await Application.findOne({job:jobId,applicant:userId})
    if(existingApplication){
        return res.status(400).json({
            message:"Already Applid for the job",
            success:false
        })
    }

    const job = await Job.findById(jobId)
    //check if the job exists 
    if(!job) {
        return res.status(400).json({
            message:"Job not found ! ",
            success:false
        })
    }

    const newApplication = await Application.create({
        job:jobId,
        applicant:userId
    })
    job.applications.push(newApplication._id)
    await job.save()

    return res.status(200).json({
        message:"Job Applied Successfully",
        success:true
    })
})

export const getAppliedJobs = TryCatch(async(req,res) => {
    const userId = req.id;
    const application  = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path:"job",
        options:{sort:{createdAt:-1}},
        populate:{
            path:'company',
            options:{sort:{createdAt:-1}},
        }
    })
    if(!application) {
        return res.status(400).json({
            message:"Applications not found !",
            success:false
        })
    }

    return res.status(200).json({
        application,
        success:true
    })
})
//Admin Dashboard
export const getApplicants = TryCatch(async(req,res) => {
    const jobId = req.params.id
    const job = await Job.findById(jobId).populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant',
            select:' -password'
        }
    })
    if(!job) {
        return res.status(400).json({
            message:"Job not found !",
            success:false
        })
    }

    return res.status(200).json({
        job,
        success:true
    })
})

export const updateStatus = TryCatch(async(req,res) => {
    const {status} = req.body;
    const applicationId = req.params.id;
    if(!status){
        return res.status(400).json({
            message:"Status is required",
            success:false
        })
    }

    const application = await Application.findOne({_id:applicationId})
    if(!application){
        return res.status(400).json({
            message:"Application not found ! ",
            success:false
        })
    }
    application.status = status.toLowerCase()
    await application.save();

    return res.status(200).json({
        message:"Status Updated Successfully",
        success:true
    })
})