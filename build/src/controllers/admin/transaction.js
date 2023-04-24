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
exports.get_all_transactions = exports.add_offline_fees = void 0;
const common_1 = require("../../common");
const transaction_1 = require("../../database/models/transaction");
const helper_1 = require("../../helper");
const database_1 = require("../../database");
const ObjectId = require("mongoose").Types.ObjectId;
const add_offline_fees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { userId, feesDetails, totalAmount } = req.body, body = req.body, { user } = req.headers;
    console.log("Id => ", userId);
    try {
        //step 0 check pendig fees first
        //step 1 transactionModel data add
        //step 2 usermodel pending fees update
        //step 0 
        let userData = yield database_1.userModel.findOne({ _id: ObjectId(userId), pendingFees: { $gte: totalAmount } });
        if (!userData)
            return res.status(400).json(new common_1.apiResponse(400, "Total amount should be less than pending fees", {}, {}));
        const response = yield transaction_1.transactionModel.create({ userId: ObjectId(userId), feesDetails: feesDetails, totalAmount: totalAmount, isActive: true, });
        // console.log("feeDetails => ",feeDetails);
        yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(userId) }, {
            $inc: {
                pendingFees: -totalAmount,
            },
        });
        console.log("transaction => ", response);
        if (response)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("fees"), response, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_offline_fees = add_offline_fees;
// export const get_all_user_fees = async(req : Request, res : Response) => {
//   reqInfo(req);
//   let {search} = req.body,match : any = []
//     try {
//       // const response = await transactionModel.find().populate("userId").lean();
//       const response = await transactionModel.find().populate({
//        path: "userId",
//        select:  "firstName lastName email phoneNumber",
//       }).select("userId totalAmount")
//       console.log(response);
//     if(response)return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("Data") , response , {}));
//     return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))
//   } 
//   catch(error){
//     console.log(error);
//   }
// }
const get_all_transactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, helper_1.reqInfo)(req);
    let response, { search, pendingFeesFilter, page, limit } = req.body, match = {};
    try {
        if (search) {
            var firstNameArray = [], lastNameArray = [], middleNameArray = [], rollNumberArray = [], stdArray = [], classArray = [];
            search = search.split(" ");
            search.forEach(data => {
                firstNameArray.push({ "user.firstName": { $regex: data, $options: 'si' } });
                lastNameArray.push({ "user.lastName": { $regex: data, $options: 'si' } });
                middleNameArray.push({ "user.middleName": { $regex: data, $options: 'si' } });
                rollNumberArray.push({ "user.rollNo": { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: firstNameArray }];
        }
        if (pendingFeesFilter)
            match.pendingFees = { $gt: 0 };
        match.isActive = true;
        console.log(match);
        response = yield transaction_1.transactionModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { userId: '$userId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$userId'] },
                                    ],
                                },
                            }
                        },
                        {
                            $project: { firstName: 1, lastName: 1, middleName: 1, rollNo: 1, standard: 1, class: 1, profilePhoto: 1 }
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
                            $unwind: {
                                path: "$standard",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ],
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $match: match },
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
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('paid fees details'), {
            paid_fees: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_a = response[0].data_count[0]) === null || _a === void 0 ? void 0 : _a.count) / ((_b = req.body) === null || _b === void 0 ? void 0 : _b.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_all_transactions = get_all_transactions;
//# sourceMappingURL=transaction.js.map