import jwt from 'jsonwebtoken'
import { TryCatch } from './error.js'

const isAuthenticated = TryCatch(async(req,res,next) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({
            message:"User not authenticated",
            success:false
        })
    }
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!decode){
        return res.status(401).json({
            message:"Invalid Token",
            success:false
        })
    }
    req.id = decode.userId 
    next()
})

export default isAuthenticated;