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
exports.get_by_id_timetable = exports.add_edit_timetable = void 0;
const helper_1 = require("../../helper");
const common_1 = require("../../common");
const timetable_1 = require("../../database/models/timetable");
const ObjectId = require('mongoose').Types.ObjectId;
const add_edit_timetable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, updateTimetable, response, { standardId, timetable } = req.body;
    try {
        const standard = yield timetable_1.timetableModel.findOne({ standardId: body === null || body === void 0 ? void 0 : body.standardId, isActive: true });
        if (standard) {
            updateTimetable = yield timetable_1.timetableModel.findOneAndUpdate({ id: ObjectId(standardId), isActive: true }, body, { new: true });
            if (!updateTimetable)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("timetable"), {}, {}));
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataSuccess("timetable"), updateTimetable, {}));
        }
        if (!standard) {
            response = yield new timetable_1.timetableModel(body).save();
            if (!response)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("timetable"), response, {}));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_edit_timetable = add_edit_timetable;
const get_by_id_timetable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    try {
        const response = yield timetable_1.timetableModel.findOne({ id: ObjectId(body === null || body === void 0 ? void 0 : body.id), class: body.class, isActive: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataNotFound("timetable"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess("timetable"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_timetable = get_by_id_timetable;
//# sourceMappingURL=timetable.js.map