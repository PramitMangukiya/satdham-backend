import jwt from 'jsonwebtoken'
// import { userModel } from '../database'
import mongoose from 'mongoose'
import {  apiResponse, userStatus } from '../common'
import { Request, response, Response } from 'express'
import { responseMessage } from './response'
import { userModel } from '../database'

const ObjectId: any = mongoose.Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;

export const userJWT = async (req: Request, res: Response, next) => {
    let { authorization, userType } = req.headers,
        result: any
    if (authorization) {
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            if (isVerifyToken?.type != userType && userType != "5") return res.status(403).json(new apiResponse(403, responseMessage?.accessDenied, {}, {}));
            if (process?.env?.NODE_ENV == 'production') {
                // 1 day expiration
                if (parseInt(isVerifyToken.generatedOn + 86400000) < new Date().getTime()) {
                    // if (parseInt(isVerifyToken.generatedOn + 120000) < new Date().getTime()) {
                    return res.status(410).json(new apiResponse(410, responseMessage?.tokenExpire, {}, {}))
                }
            }

            // result = await userModel.findOne({ _id: ObjectId(isVerifyToken._id), isActive: true })
            if (result?.isBlock == false) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
            if (result?.isActive == true && isVerifyToken.authToken == result.authToken) {
                // Set in Header Decode Token Information
                req.headers.user = result
                return next()
            } else {
                return res.status(401).json(new apiResponse(401, responseMessage?.invalidToken, {}, {}))
            }
        } catch (err) {
            if (err.message == "invalid signature") return res.status(403).json(new apiResponse(403, responseMessage?.differentToken, {}, {}))
            console.log(err)
            return res.status(401).json(new apiResponse(401, responseMessage.invalidToken, {}, {}))
        }
    } else {
        return res.status(401).json(new apiResponse(401, responseMessage?.tokenNotFound, {}, {}))
    }
}

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