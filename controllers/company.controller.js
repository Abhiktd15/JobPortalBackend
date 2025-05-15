import { TryCatch } from "../middlewares/error.js";
import { Company } from "../models/company.models.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const registerCompany = TryCatch(async(req, res) => {
    const {companyName} = req.body;
    if(!companyName){
        return res.status(400).json({
            message:"Company Name is Required",
            success:false
        })
    }
    let company = await Company.findOne({name:companyName})
    if(company){
        return res.status(400).json({
            message:"You can't Register Same company",
            success:false
        })
    }
    company = await Company.create({
        name:companyName,
        userId:req.id
    })

    return res.status(201).json({
        message:"Company registered successfully",
        company,
        success:true
    })
})

export const getCompany = TryCatch(async(req,res) => {
    const userId = req.id;
    
    const companies = await Company.find({userId}).sort({createdAt:-1})

    if(!companies){
        return res.status(404).json({
            message:"Companies not found",
            success:false
        })
    }
    
    return res.status(200).json({
        companies,
        success:true
    })
})

export const getCompanyById = TryCatch(async(req,res) => {
    const companyId = req.params.id;

    const company = await Company.findById(companyId)
    if(!company){
        return res.status(404).json({
            message:"Companies not found",
            success:false
        })
    }

    return res.status(200).json({
        company,
        success:true
    })
    
})

export const updateCompany = TryCatch(async(req,res) => {
    const {name,description,website,location} = req.body;
    const file = req.file
    let FileURI;
    if(file){
        FileURI = getDataUri(file)
    }

    let cloudResponse;
    if(file){
        cloudResponse = await cloudinary.uploader.upload(FileURI.content)
    }
    const logo  = cloudResponse?.secure_url

    const companyId = req.params.id;

    const company = await Company.findByIdAndUpdate(companyId,{
        name,
        description,
        website,
        location,
        logo
    },{new:true})
    
    if(!company){
        return res.status(404).json({
            message:"Companies not found",
            success:false
        })
    }

    return res.status(200).json({
        message:"Company Updated Successfully",
        success:true
    })
    
})