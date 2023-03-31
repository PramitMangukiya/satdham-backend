"use strict"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { userModel, userSessionModel } from '../../database'
import { apiResponse } from '../../common'
import { email_verification_mail, forgot_password_mail, reqInfo, responseMessage } from '../../helper'

const ObjectId = require('mongoose').Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET


export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body,
            otp,
            otpFlag = 1, // OTP has already assign or not for cross-verification
            authToken = 0
            let  isAlready : any = await userModel.findOne({ email: body?.email, isActive: true });
        if (isAlready) return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}))
         isAlready = await userModel.findOne({ phoneNumber: body?.phoneNumber, isActive: true })
        if (isAlready) return res.status(409).json(new apiResponse(409, "phone number exist already", {}, {}))
        

        if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        body.userType = "admin";
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        body.userType = "admin"
        let response = await new userModel(body).save()
        response = {
            userType: response?.userType,
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
        }

        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = await userModel.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }

        let result: any = await email_verification_mail(response, otp);
        if (result) {
            await userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(new apiResponse(200, `${result}`, {}, {}));
        }
        else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const otp_verification = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        body.isActive = true
        let data = await userModel.findOne(body);
        if (!data) return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP, {}, {}))
        if (data.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}))
        if (data) {
            let response = await userModel.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn : true }, { new: true });
            const token = jwt.sign({
                _id: response._id,
                type: response.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, jwt_token_secret)

            await new userSessionModel({
                createdBy: response._id,
            }).save()

            let result = {
                isEmailVerified: response?.isEmailVerified,
                userType: response?.userType,
                _id: response?._id,
                email: response?.email,
                token,
            }
            return res.status(200).json(new apiResponse(200, responseMessage?.OTPverified, result, {}))
        }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => { //email and password
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        console.log(body);
        response = await userModel.findOneAndUpdate({ email: body?.email, isActive: true , userType : "admin" }, { $addToSet: { deviceToken: body?.deviceToken } , isLoggedIn : true }).select('-__v -createdAt -updatedAt')

        console.log(response);
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))

        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
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
            isEmailVerified: response?.isEmailVerified,
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const forgot_password = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //email or phoneNumber
        otpFlag = 1, // OTP has already assign or not for cross-verification
        otp = 0
    try {
        body.isActive = true;
        let data = await userModel.findOne(body);

        if (!data) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidEmail, {}, {}));
        }
        if (data.isBlock == true) {
            return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
        }

        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = await userModel.findOne({ otp: otp });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }
        let response: any = await forgot_password_mail(data, otp).then(result => { return result }).catch(error => { return error })
        if (response) {
            await userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
            return res.status(200).json(new apiResponse(200, `otp is : ${otp} - ${response}`, {}, {}));
        }
        else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${response}`));
    } catch (error) {
        return res
            .status(500)
            .json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const reset_password = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        { email } = body;

    try {
console.log(body);
        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        delete body.id
        body.password = hashPassword

        let response = await userModel.findOneAndUpdate({ email: body?.email, isActive: true}, body, { new: true }) // otp: null
        
        if (response) 
            return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess, response, {}))
        
        else return res.status(501).json(new apiResponse(501, responseMessage?.resetPasswordError, {}, {}))

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const resend_otp = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body, //required id or email of user and role
    otpFlag = 1, // OTP has already assign or not for cross-verification
    otp = 0
    try {
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = await userModel.findOne({ otp: otp, userType : "admin" });
            if (isAlreadyAssign?.otp != otp) otpFlag = 0;
        }
        const response = await userModel.findOneAndUpdate({ email: body?.email, isActive: true , userType : "admin" , otp : {$ne : null}}, { otp: otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
        if (!response) 
         return res.status(404).json(new apiResponse(404, "Unable to send otp!", null, {}))
        //user saved succesfully now send otp to the user
        let result: any = await forgot_password_mail(response, otp);

        if (!result) {
            //tap on resend otp
            await userModel.findOneAndUpdate({  email: body?.email , isActive : true , userType : "admin"  }, { otp: null, otpExpireTime: null });
            return res.status(501).json(new apiResponse(501, "Error in sending otp from server tap on resend otp", {}, {}));
        }
        //otp sended
        return res.status(200).json(new apiResponse(200, `otp is - ${otp} - ${result}`, {}, {}));
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, null, error))
    }
}

