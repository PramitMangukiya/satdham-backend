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
exports.login = void 0;
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;
const ObjectId = require("mongoose").Types.ObjectId;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body, response;
    try {
        // Find the user with the given userId
        response = yield database_1.userModel.findOne({ userId: body === null || body === void 0 ? void 0 : body.userId, isActive: true, userType: "user" });
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.invalidUserPasswordEmail, {}, {}));
        if (response.password !== body.password)
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
            userType: response === null || response === void 0 ? void 0 : response.userType,
            _id: response === null || response === void 0 ? void 0 : response._id,
            email: response === null || response === void 0 ? void 0 : response.email,
            token,
        };
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.loginSuccess, response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, {}));
    }
});
exports.login = login;
//# sourceMappingURL=login.js.map