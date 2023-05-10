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
exports.get_attendance_by_date_std_subject = exports.add_edit_attendance = void 0;
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const add_edit_attendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, { _id, attendance } = req.body, { user } = req.headers; //{_id , attendance}
    try {
        const updatedAttendance = yield database_1.attendanceModel.findOneAndUpdate({ _id: ObjectId(_id), isActive: true }, body, { new: true });
        if (updatedAttendance)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("attendance"), updatedAttendance, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_edit_attendance = add_edit_attendance;
// export const edit_attendance_by_id = async(req,res) =>
// {
//     reqInfo(req)
//     let { attendance } = req.headers,
//         body = req.body; 
//     try {
//         const response = await attendanceModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
//         return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("attendance"), response, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
// export const delete_attendance_by_id = async(req,res) =>
// {
//     reqInfo(req)
//     let { attendance } = req.headers,
//         body = req.body,
//         {id} = req.params
//     try {
//         const response = await attendanceModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
//         return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("attendance"), {}, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
const get_attendance_by_date_std_subject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, helper_1.reqInfo)(req);
    let response, { standard, date, subject } = req.body, match = {};
    try {
        match.isActive = true;
        match.date = { $gt: (0, common_1.get_next_Date)(new Date(date), -1), $lte: new Date(date) };
        match.standard = ObjectId(standard);
        let attendance = yield database_1.attendanceModel.findOne(Object.assign({}, match));
        if (!attendance) {
            //then make new attendance entry in that 
            let standardData = yield database_1.standardModel.findOne({ _id: ObjectId(standard), isActive: true });
            let studentData = yield database_1.userModel.find({ isActive: true, userType: "user", standard: ObjectId(standard) });
            let responseStudentData = [];
            for (let i = 0; i < (studentData === null || studentData === void 0 ? void 0 : studentData.length); i++) {
                let student = studentData[i];
                // console.log(student);
                student = {
                    _id: ObjectId(student === null || student === void 0 ? void 0 : student._id),
                    rollNo: student === null || student === void 0 ? void 0 : student.rollNo,
                    name: `${student === null || student === void 0 ? void 0 : student.firstName} ${student === null || student === void 0 ? void 0 : student.lastName}`,
                    attendance: null
                };
                // student.attendance = null;
                responseStudentData.push(student);
            }
            console.log((_a = studentData[0]) === null || _a === void 0 ? void 0 : _a.attendance, "is field attendance");
            // console.log("student Data" , studentData);
            let subjects = standardData.subjects; //take out subject from timetableModel(std id and class)
            // console.log(subjects);
            let preAttendance = {};
            for (let i = 0; i < (subjects === null || subjects === void 0 ? void 0 : subjects.length); i++) {
                let item = subjects[i];
                preAttendance[`${item}`] = [...responseStudentData];
            }
            let new_attendance = {
                standard: ObjectId(standard),
                date: new Date(date),
                attendance: preAttendance
            };
            const attendanceData = yield new database_1.attendanceModel(new_attendance).save();
            console.log(attendanceData, "attendanceData");
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("attendance"), attendanceData, {}));
        }
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess("attendance"), attendance, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_attendance_by_date_std_subject = get_attendance_by_date_std_subject;
// export const get_by_id_attendance = async(req,res)=>
// {
//         reqInfo(req);
//         let { attendance } = req.headers,
//             body = req.body,
//           { id } = req.params;
//         try {
//             const response = await attendanceModel.findOne({ _id : ObjectId(id) , isActive : true});
//             if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("attendance"), {}, {}));
//             return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("attendance"), response, {}));
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
// }
// }
//# sourceMappingURL=attendance.js.map