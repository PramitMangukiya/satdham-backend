"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resend_otp = exports.reset_password = exports.forgot_password = exports.login = exports.otp_verification = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let body = req.body, otp, otpFlag = 1, // OTP has already assign or not for cross-verification
        authToken = 0;
        let isAlready = yield database_1.userModel.findOne({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true });
        if (isAlready)
            return res.status(409).json(new common_1.apiResponse(409, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.alreadyEmail, {}, {}));
        isAlready = yield database_1.userModel.findOne({ phoneNumber: body === null || body === void 0 ? void 0 : body.phoneNumber, isActive: true });
        if (isAlready)
            return res.status(409).json(new common_1.apiResponse(409, "phone number exist already", {}, {}));
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isBlock) == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        body.userType = "admin";
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        body.password = hashPassword;
        body.userType = "admin";
        let response = yield new database_1.userModel(body).save();
        response = {
            userType: response === null || response === void 0 ? void 0 : response.userType,
            isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
            _id: response === null || response === void 0 ? void 0 : response._id,
            email: response === null || response === void 0 ? void 0 : response.email,
        };
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield database_1.userModel.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        let result = yield (0, helper_1.email_verification_mail)(response, otp);
        if (result) {
            yield database_1.userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
            return res.status(200).json(new common_1.apiResponse(200, `${result}`, {}, {}));
        }
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${result}`));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.signUp = signUp;
const otp_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    try {
        body.isActive = true;
        let data = yield database_1.userModel.findOne(body);
        if (!data)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidOTP, {}, {}));
        if (data.isBlock == true)
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime())
            return res.status(410).json(new common_1.apiResponse(410, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.expireOTP, {}, {}));
        if (data) {
            let response = yield database_1.userModel.findOneAndUpdate(body, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn: true }, { new: true });
            const token = jsonwebtoken_1.default.sign({
                _id: response._id,
                type: response.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, jwt_token_secret);
            yield new database_1.userSessionModel({
                createdBy: response._id,
            }).save();
            let result = {
                isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
                userType: response === null || response === void 0 ? void 0 : response.userType,
                _id: response === null || response === void 0 ? void 0 : response._id,
                email: response === null || response === void 0 ? void 0 : response.email,
                token,
            };
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.OTPverified, result, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.otp_verification = otp_verification;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body, response;
    (0, helper_1.reqInfo)(req);
    try {
        console.log(body);
        response = yield database_1.userModel.findOneAndUpdate({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true, userType: "admin" }, { $addToSet: { deviceToken: body === null || body === void 0 ? void 0 : body.deviceToken }, isLoggedIn: true }).select('-__v -createdAt -updatedAt');
        console.log(response);
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidUserPasswordEmail, {}, {}));
        const passwordMatch = yield bcryptjs_1.default.compare(body.password, response.password);
        if (!passwordMatch)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidUserPasswordEmail, {}, {}));
        const token = jsonwebtoken_1.default.sign({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret);
        yield new database_1.userSessionModel({
            createdBy: response._id,
        }).save();
        response = {
            isEmailVerified: response === null || response === void 0 ? void 0 : response.isEmailVerified,
            userType: response === null || response === void 0 ? void 0 : response.userType,
            _id: response === null || response === void 0 ? void 0 : response._id,
            email: response === null || response === void 0 ? void 0 : response.email,
            token,
        };
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.loginSuccess, response, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.login = login;
const forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, //email or phoneNumber
    otpFlag = 1, // OTP has already assign or not for cross-verification
    otp = 0;
    try {
        body.isActive = true;
        let data = yield database_1.userModel.findOne(body);
        if (!data) {
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidEmail, {}, {}));
        }
        if (data.isBlock == true) {
            return res.status(403).json(new common_1.apiResponse(403, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.accountBlock, {}, {}));
        }
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield database_1.userModel.findOne({ otp: otp });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        let response = yield (0, helper_1.forgot_password_mail)(data, otp).then(result => { return result; }).catch(error => { return error; });
        if (response) {
            yield database_1.userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
            return res.status(200).json(new common_1.apiResponse(200, `otp is : ${otp} - ${response}`, {}, {}));
        }
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.errorMail, {}, `${response}`));
    }
    catch (error) {
        return res
            .status(500)
            .json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.forgot_password = forgot_password;
const reset_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { email } = body;
    try {
        console.log(body);
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        delete body.id;
        body.password = hashPassword;
        let response = yield database_1.userModel.findOneAndUpdate({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true }, body, { new: true }); // otp: null
        if (response)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.resetPasswordSuccess, response, {}));
        else
            return res.status(501).json(new common_1.apiResponse(501, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.resetPasswordError, {}, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.reset_password = reset_password;
const resend_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, //required id or email of user and role
    otpFlag = 1, // OTP has already assign or not for cross-verification
    otp = 0;
    try {
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = yield Math.round(Math.random() * 1000000);
                if (otp.toString().length == 4) {
                    flag++;
                }
            }
            let isAlreadyAssign = yield database_1.userModel.findOne({ otp: otp, userType: "admin" });
            if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.otp) != otp)
                otpFlag = 0;
        }
        const response = yield database_1.userModel.findOneAndUpdate({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true, userType: "admin", otp: { $ne: null } }, { otp: otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, "Unable to send otp!", null, {}));
        //user saved succesfully now send otp to the user
        let result = yield (0, helper_1.forgot_password_mail)(response, otp);
        if (!result) {
            //tap on resend otp
            yield database_1.userModel.findOneAndUpdate({ email: body === null || body === void 0 ? void 0 : body.email, isActive: true, userType: "admin" }, { otp: null, otpExpireTime: null });
            return res.status(501).json(new common_1.apiResponse(501, "Error in sending otp from server tap on resend otp", {}, {}));
        }
        //otp sended
        return res.status(200).json(new common_1.apiResponse(200, `otp is - ${otp} - ${result}`, {}, {}));
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, null, error));
    }
});
exports.resend_otp = resend_otp;
//# sourceMappingURL=auth.js.map