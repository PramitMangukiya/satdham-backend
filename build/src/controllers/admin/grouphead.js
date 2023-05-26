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
exports.get_by_id_groupHead = exports.get_all_groupHead = exports.delete_groupHead_by_id = exports.edit_groupHead_by_id = exports.add_groupHead = void 0;
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const add_groupHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, //{question , options , ans }
    { user } = req.headers;
    try {
        //assign groupHeadId and password
        body.studentId = ObjectId(body.studentId);
        const response = yield new database_1.groupHeadModel(body).save();
        if (response)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("groupHead"), response, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_groupHead = add_groupHead;
const edit_groupHead_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { groupHead } = req.headers, body = req.body;
    try {
        const response = yield database_1.groupHeadModel.findOneAndUpdate({ _id: ObjectId(body._id), isActive: true }, body, { new: true });
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("groupHead"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("groupHead"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.edit_groupHead_by_id = edit_groupHead_by_id;
const delete_groupHead_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { groupHead } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield database_1.groupHeadModel.findOneAndUpdate({ _id: ObjectId(id), isActive: true }, { isActive: false }, { new: true });
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("groupHead"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.deleteDataSuccess("groupHead"), {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.delete_groupHead_by_id = delete_groupHead_by_id;
const get_all_groupHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, helper_1.reqInfo)(req);
    let response, { page, limit, search, groupHeadFilter } = req.body, match = {}, matchAtLast = {};
    try {
        if (search) {
            var groupHeadArray = [], firstNameArray = [];
            search = search.split(" ");
            search.forEach(data => {
                groupHeadArray.push({ type: { $regex: data, $options: 'si' } });
                firstNameArray.push({ "user.firstName": { $regex: data, $options: 'si' } });
            });
            matchAtLast.$or = [{ $and: groupHeadArray }, { $and: firstNameArray }];
        }
        // if(groupHeadFilter) match.subjectId = ObjectId(groupHeadFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true;
        response = yield database_1.groupHeadModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "users",
                    let: { studentId: '$studentId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$studentId'] },
                                    ],
                                },
                            }
                        },
                        {
                            $lookup: {
                                from: "standards",
                                let: { standardId: '$standard' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$_id', '$$standardId'] },
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
                            $unwind: { path: "$standard", preserveNullAndEmptyArrays: true }
                        },
                    ],
                    as: "user"
                }
            },
            {
                $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
            },
            { $match: matchAtLast },
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
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('groupHead'), {
            groupHead_data: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_a = response[0].data_count[0]) === null || _a === void 0 ? void 0 : _a.count) / ((_b = req.body) === null || _b === void 0 ? void 0 : _b.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_all_groupHead = get_all_groupHead;
const get_by_id_groupHead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { groupHead } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield database_1.groupHeadModel.findOne({ _id: ObjectId(id), isActive: true });
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("groupHead"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("groupHead"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_groupHead = get_by_id_groupHead;
//# sourceMappingURL=grouphead.js.map