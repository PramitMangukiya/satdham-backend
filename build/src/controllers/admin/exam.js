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
exports.get_by_id_student_exam = exports.get_registered_student_by_exam_id = exports.edit_or_add_exam_marks_of_student = exports.get_by_id_exam = exports.get_all_exam = exports.delete_exam_by_id = exports.edit_exam_by_id = exports.add_exam = void 0;
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const exam_student_1 = require("../../database/models/exam_student");
const ObjectId = require('mongoose').Types.ObjectId;
const add_exam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, helper_1.reqInfo)(req);
    let body = req.body, //{question , options , ans }
    { user } = req.headers;
    try {
        //assign examId and password
        //step1 --> save exam then find all the students of that standard
        //step2 --> for loop for iterating over each student and add them in exam_student schema
        //step3 ---> add  marks array in every document
        //step1
        const exam = yield new database_1.examModel(body).save();
        console.log(exam._doc, "examData");
        //step2
        const students = yield database_1.userModel.find({ userType: "user", isActive: true, standard: ObjectId(exam === null || exam === void 0 ? void 0 : exam.standard) });
        //copying timetable into marks
        let marks = [...((_a = exam._doc) === null || _a === void 0 ? void 0 : _a.timetable)];
        console.log(marks, "marks format to be saved in db");
        for (let student of students) {
            let examStudentEntry = {
                examId: ObjectId(exam === null || exam === void 0 ? void 0 : exam._id),
                studentId: ObjectId(student === null || student === void 0 ? void 0 : student._id),
                marks: marks,
            };
            yield new exam_student_1.examStudentModel(examStudentEntry).save();
        }
        if (students)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("exam"), exam, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_exam = add_exam;
const edit_exam_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { exam } = req.headers, body = req.body;
    try {
        const response = yield database_1.examModel.findOneAndUpdate({ _id: ObjectId(body._id), isActive: true }, body, { new: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("exam"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("exam"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.edit_exam_by_id = edit_exam_by_id;
const delete_exam_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { exam } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield database_1.examModel.findOneAndUpdate({ _id: ObjectId(id), isActive: true }, { isActive: false }, { new: true });
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("exam"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.deleteDataSuccess("exam"), {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.delete_exam_by_id = delete_exam_by_id;
const get_all_exam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    (0, helper_1.reqInfo)(req);
    let response, { page, limit, search, examFilter, subjectFilter } = req.body, match = {};
    try {
        if (search) {
            var examArray = [], standardArray = [];
            search = search.split(" ");
            search.forEach(data => {
                examArray.push({ name: { $regex: data, $options: 'si' } });
                standardArray.push({ name: { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: examArray }, { $and: standardArray }];
        }
        // if(examFilter) match.subjectId = ObjectId(   );
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true;
        if (subjectFilter)
            match.subject = subjectFilter;
        response = yield database_1.examModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "standards",
                    let: { stdId: '$standard' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$stdId'] },
                                    ],
                                },
                            }
                        },
                    ],
                    as: "standard"
                }
            },
            {
                $unwind: "$standard"
            },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('exam'), {
            exam_data: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_b = response[0].data_count[0]) === null || _b === void 0 ? void 0 : _b.count) / ((_c = req.body) === null || _c === void 0 ? void 0 : _c.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_all_exam = get_all_exam;
const get_by_id_exam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { exam } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield database_1.examModel.findOne({ _id: ObjectId(id), isActive: true }).populate("standard").lean();
        // let registerStudents= await examStudentModel.find({examId : ObjectId(response?._id)})
        // .populate({
        //     path: "studentId",
        //     select: "firstName lastName middleName rollNo class",
        //     as: "student"
        //   });
        // console.log(registerStudents[0] , "student log");
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("exam"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("exam"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_exam = get_by_id_exam;
const edit_or_add_exam_marks_of_student = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { exam } = req.headers, body = req.body, { examStudentId } = req.body;
    try {
        const response = yield exam_student_1.examStudentModel.findOneAndUpdate({ _id: ObjectId(examStudentId) }, body, { new: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("exam"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("exam"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.edit_or_add_exam_marks_of_student = edit_or_add_exam_marks_of_student;
const get_registered_student_by_exam_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    (0, helper_1.reqInfo)(req);
    let response, { examId, classFilter, page, limit, search } = req.body, match = {};
    try {
        if (search) {
            var examArray = [];
            search = search.split(" ");
            search.forEach(data => {
                examArray.push({ name: { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: examArray }];
        }
        match.examId = ObjectId(examId);
        if (classFilter)
            match["student.class"] = classFilter;
        response = yield exam_student_1.examStudentModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { studentId: "$studentId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$studentId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                middleName: 1,
                                rollNo: 1,
                                class: 1,
                                phoneNumber: 1,
                                profilePhoto: 1
                            }
                        }
                    ],
                    as: "student"
                }
            },
            {
                $unwind: "$student"
            },
            { $match: match },
            {
                $lookup: {
                    from: "exams",
                    let: { examId: "$examId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$examId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "standards",
                                let: { stdId: '$standard' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$_id', '$$stdId'] },
                                                ],
                                            },
                                        }
                                    },
                                    { $project: { name: 1, number: 1 } }
                                ],
                                as: "standard"
                            }
                        },
                        {
                            $unwind: "$standard"
                        },
                        {
                            $project: {
                                standard: 1,
                                name: 1,
                                type: 1,
                                isWithPractical: 1,
                            }
                        }
                    ],
                    as: "exam"
                }
            },
            {
                $unwind: "$exam"
            },
            {
                $project: { studentId: 0, examId: 0 }
            },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('exam'), {
            registered_students: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_d = response[0].data_count[0]) === null || _d === void 0 ? void 0 : _d.count) / ((_e = req.body) === null || _e === void 0 ? void 0 : _e.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_registered_student_by_exam_id = get_registered_student_by_exam_id;
const get_by_id_student_exam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { exam } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield exam_student_1.examStudentModel.findOne({ _id: ObjectId(id) }).populate({
            path: "studentId",
            select: "firstName lastName middleName rollNo class phone"
        }).lean();
        // let registerStudents= await examStudentModel.find({examId : ObjectId(response?._id)})
        // .populate({
        //     path: "studentId",
        //     select: "firstName lastName middleName rollNo class",
        //     as: "student"
        //   });
        // console.log(registerStudents[0] , "student log");
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("exam"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("exam"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_student_exam = get_by_id_student_exam;
//# sourceMappingURL=exam.js.map