import jwt from 'jsonwebtoken'
// import { userModel } from '../database'
import mongoose from 'mongoose'
import {  apiResponse, userStatus } from '../common'
import { Request, response, Response } from 'express'
import { responseMessage } from './response'
import { userModel } from '../database'

const ObjectId: any = mongoose.Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;



export const adminJWT = async (req: Request, res: Response, next) => {
    let { authorization, userType } = req.headers,
        result: any
    if (authorization) {
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            console.log(isVerifyToken);
            result = await userModel.findOne({ _id: ObjectId(isVerifyToken?._id), isActive: true , userType : "admin" })
            if(!result)
            result = await userModel.findOne({ _id: ObjectId(isVerifyToken?._id), isActive: true , userType : "faculty" })
            console.log(result);
            if (result?.isBlock == true) return res.status(403).json(new apiResponse(403, 'Your account han been blocked.', {}, {}));
            if (result?.isActive == true && isVerifyToken.authToken == result.authToken && isVerifyToken.type == result.userType) {
                // Set in Header Decode Token Information
                req.headers.user = result
                return next()
            } else {
                return res.status(401).json(new apiResponse(401, "Invalid-Token", {}, {}))
            }
        } catch (err) {
            if (err.message == "invalid signature") return res.status(403).json(new apiResponse(403, `Don't try different one token`, {}, {}))
            console.log(err)
            return res.status(401).json(new apiResponse(401, "Invalid Token", {}, {}))
        }
    } else {
        return res.status(401).json(new apiResponse(401, "Token not found in header", {}, {}))
    }
}

export const uploadJWT = async (req: Request, res: Response, next) => {
    let { authorization, userType } = req.headers,
        result: any
    if (authorization) { 
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            result = await userModel.findOne({ _id: ObjectId(isVerifyToken._id), isActive: true });
            // if(!result) result = await userModel.findOne({ _id: ObjectId(isVerifyToken._id), isActive: true });
            // if(!result) result = await adminModel.findOne({ _id: ObjectId(isVerifyToken._id), isActive: true });
            
            if (result?.isBlock == true) return res.status(403).json(new apiResponse(403, 'Your account han been blocked.', {}, {}));
            if (result?.isActive == true  && isVerifyToken.type == result.userType){
                // Set in Header Decode Token Information
                req.headers.user = result
                return next();
            } else {
                return res.status(401).json(new apiResponse(401, "Invalid-Token", {}, {}))
            }
        } catch (err) {
            if (err.message == "invalid signature") return res.status(403).json(new apiResponse(403, `Don't try different one token`, {}, {}))
            console.log(err)
            return res.status(401).json(new apiResponse(401, "Invalid Token", {}, {}))
        }
    } else {
        return res.status(401).json(new apiResponse(401, "Token not found in header", {}, {}))
    }
}

export const userJWT = async (req:Request, res:Response, next) =>{
    let{authorization} = req.headers,
    response:any
        if(authorization){
            try{
                let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
                response = await userModel.findOne({_id:ObjectId(isVerifyToken._id), isActive:true })
                if(response?.isBlock == true) return res.status(403).json(new apiResponse(403, "Your account has been blocked.",{},{}))
                if(response?.isActive == true && isVerifyToken.type == response.userType){
                    req.headers.user = response
                    return next();
                }else{
                    return res.status(401).json(new apiResponse(401, "Invalid Token",{},{}))
                }
                    
            }catch(error){
                if(error.message == "invalid signature") return res.status(403).json(new apiResponse(403, "Don't try different one token",{},{}))
                console.log(error);
                return res.status(401).json(new apiResponse(401, "Invalid Token",{},{}));
            }
        }else{
            return res.status(401).json(new apiResponse(401, "Token not found in header",{},{}))
        }
}