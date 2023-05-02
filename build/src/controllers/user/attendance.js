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
exports.get_by_id_attendance = void 0;
const database_1 = require("../../database");
const common_1 = require("../../common");
const helper_1 = require("../../helper");
const ObjectId = require("mongoose").Types.ObjectId;
const get_by_id_attendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { id } = req.params, { _id, monthStartDate } = req.body, match = {};
    try {
        const attandance = yield database_1.attendanceModel.findOne({ _id: ObjectId(id), isActive: true });
        if (!attandance)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("attendance"), {}, {}));
        let monthEndDate = (0, common_1.getMonthEndDate)(new Date(monthStartDate));
        match.date = { $gte: monthStartDate, $lte: monthEndDate };
        let response = yield database_1.attendanceModel.find(Object.assign(Object.assign({}, match), { isActive: true })); // response array of object
        console.log("response => ", response);
        const responseAttendance = [];
        for (let day of response) {
            console.log("day => ", day);
            let singleAttendance = {
                date: day === null || day === void 0 ? void 0 : day.date,
                attendance: {}
            };
            console.log("day => ", singleAttendance);
            let attendanceData = day.attendance;
            console.log("day => ", attendanceData); //iterating in object called attendanceData
            for (let subject in attendanceData) {
                const allStudentData = attendanceData[subject]; //means [] containing all data
                //now iterate over that data to find our user and if user is present then send true or false
                const data = allStudentData.find(item => item._id = ObjectId(id));
                singleAttendance.attendance[subject] = data.attendance;
            }
            responseAttendance.push(singleAttendance);
        }
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("attendance"), attandance, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_attendance = get_by_id_attendance;
// const getUserID = async (req, res) => {
//     try {
//       const order = await orderModel.findOne({ _id: req.params.orderId });
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }
//       const userId = order.userId;
//       res.status(200).json({ userId });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
//# sourceMappingURL=attendance.js.map