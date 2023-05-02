import { Request, Response } from "express";
import { userModel, userSessionModel } from "../../database";
import { apiResponse } from "../../common";
import { responseMessage } from "../../helper";
import jwt from 'jsonwebtoken'


const jwt_token_secret = process.env.JWT_TOKEN_SECRET
const ObjectId = require("mongoose").Types.ObjectId

export const login = async (req: Request, res: Response) => {
    let body = req.body,
        response:any
        try {
            // Find the user with the given userId
            response = await userModel.findOne({userId: body?.userId, isActive:true, userType:"user"});
        if (!response) 
            return res.status(400).json(new apiResponse(400 , responseMessage?.invalidUserPasswordEmail , {} , {}));
        if(response.password !== body.password)
           return res.status(400).json(new apiResponse(400 , responseMessage?.invalidUserPasswordEmail , {} , {}));
        const token = jwt.sign({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret)

        await new userSessionModel({
            createdBy: response._id,
        }).save()
        response = {
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess,response,{}))
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500 , responseMessage?.internalServerError , {} , {}));
    }
}
