import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.models.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { decode } from "punycode";

export const register = TryCatch(async (req,res) => {
    const {fullName,email,phoneNumber,password,role} = req.body;
    if(!fullName || !email || !phoneNumber || !password || !role){
        return res.status(400).json({
            message:"Some Fields are missing",
            success:false
        })
    }
    const file = req.file;
    const fileURI = getDataUri(file)

    let cloudRespose;
    if(file){
        cloudRespose =  await cloudinary.uploader.upload(fileURI.content)    
    }

    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({
            message:"User with this email already exists",
            success:false
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await User.create({
        fullName,
        email,
        password:hashedPassword,
        phoneNumber,
        role,
        profile:{
            profilePhoto: cloudRespose.secure_url
        }
    })

    return res.status(201).json({
        message: "Account Created Successfully",
        success:true
    })
})

export const login = TryCatch(async(req,res) => {
    const {email,password,role} = req.body;

    if(!email || !password || !role) {
        return res.status(400).json({
            message:"Some Fields are missing",
            success:false
        })
    }
    let user = await User.findOne({email})
    if(!user) {
        return res.status(400).json({
            message:"Incorrect Credentials ! ",
            success:false
        })
    }

    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"Incorrect Email or password",
            success:false
        })
    }
    
    //Check for the role of the user 
    if(role !== user.role){
        return res.status(400).json({
            message:"Account does not exists with current role",
            success:false
        })
    }

    const tokenData = {
        userId: user._id
    }
    const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

    user = {
        _id: user._id,
        fullName:user.fullName,
        email:user.email,
        phoneNumber : user.phoneNumber,
        role : user.role,
        profile: user.profile
    }

    return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:"strict"}).json({
        message:`Welcome Back ${user.fullName}`,
        user,
        success:true
    })
})

export const logout = TryCatch(async(req,res) => {
    return res.status(200).cookie("token","",{maxAge:0}).json({
        message:"User Logged Out successfully",
        success:true
    })
})

export const updateProfile = TryCatch(async(req,res) => {
    const {fullName,email,phoneNumber,bio,skills} = req.body;
    const file = req.file;

    let cloudRespose;
    if(file){
        const fileURI = getDataUri(file)
        cloudRespose = await cloudinary.uploader.upload(fileURI.content, {
            resource_type: "raw"
            });
    }
    let skillsArray;
    if(skills){
        skillsArray = skills.split(',')
    }
    const userId = req.id

    let user = await User.findById(userId)
    if(!user){
        return res.status(400).json({
            message:"User not found",
            success:false
        })
    }
    //update data
    if(fullName) user.fullName = fullName
    
    if(phoneNumber) user.phoneNumber = phoneNumber;
    if(email) user.email = email;
    if(bio) user.profile.bio = bio;
    if(skills) user.profile.skills = skillsArray;
    
    //resume update later
    if(cloudRespose) { 
        user.profile.resume = cloudRespose.secure_url;
        user.profile.resumeOriginalName = file.originalname;
    }

    await user.save()

    user = {
        _id: user._id,
        fullName:user.fullName,
        email:user.email,
        phoneNumber : user.phoneNumber,
        role : user.role,
        profile: user.profile
    }
    return res.status(200).json({
        message:"Profile Updated Successfully ",
        user,
        success:true
    })
})

export const isAuthorized = TryCatch(async(req,res) => {

    const userId = req.id
    let user = await User.findById(userId)

    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:false
        })
    }
    user = {
        _id: user._id,
        fullName:user.fullName,
        email:user.email,
        phoneNumber : user.phoneNumber,
        role : user.role,
        profile: user.profile
    }
    return res.status(200).json({
        message:`Welcome Back ${user.fullName}`,
        user,
        success:true
    })

})