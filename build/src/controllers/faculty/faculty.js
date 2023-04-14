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
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit_faculty = void 0;
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const common_1 = require("../../common");
const ObjectId = require("mongoose").Types.ObjectId;
const edit_faculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { _id, attendance } = req.body, { user } = req.headers;
    try {
        const response = yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(body._id), userType: "faculty", isActive: true }, body, { new: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("faculty"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("faculty"), response, {}));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.edit_faculty = edit_faculty;
//# sourceMappingURL=faculty.js.map