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
exports.get_by_id_exam = void 0;
const common_1 = require("../../common");
const exam_student_1 = require("../../database/models/exam_student");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const get_by_id_exam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { id } = req.params;
    try {
        // const student = await userModel.findById(id).populate('standard').lean();
        // if (!student) {
        //     return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('exam'),{},{}));
        // }
        const exam = yield exam_student_1.examStudentModel.find({ studentId: ObjectId(id), isExamMarks: true }).populate('examId', 'standard  name type isWithPractical').lean();
        if (!exam)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataNotFound('exam'), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('exam'), exam, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_exam = get_by_id_exam;
//# sourceMappingURL=exam.js.map