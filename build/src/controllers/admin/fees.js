// import { Request, Response } from "express";
// import { apiResponse } from "../../common";
// import { attendanceModel, standardModel, feesModel } from "../../database";
// import { reqInfo, responseMessage } from "../../helper";
// const ObjectId = require('mongoose').Types.ObjectId
//work pending
// export const add_offline_fees_entry = async (req: Request, res: Response) => {
//     reqInfo(req);
//     let body = req.body, //{question , options , ans }
//         {user} : any = req.headers,
//         {userId , collectedAmount}:any = req.body
//     try {
//         //assign feesId and password
//         const response = await new feesModel(body).save();
//         if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("fees") , response , {}));
//          return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
// export const get_all_fees = async (req, res) => {
//     reqInfo(req)
//     let response: any, { page, limit, search , feesTypeFilter , pendingFeesFilter} = req.body, match: any = {};
//     try {
//         if (search){
//             var firstNameArray: Array<any> = [] ,  lastNameArray: Array<any> = [] , phoneNumberArray: Array<any> = [], 
//             feesIdArray: Array<any> = []
//             search = search.split(" ")
//             search.forEach(data => {
//                 firstNameArray.push({ firstName: { $regex: data, $options: 'si' } })
//                 lastNameArray.push({ lastName: { $regex: data, $options: 'si' } })
//                 phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } })
//                 feesIdArray.push({ feesId: { $regex: data, $options: 'si' } })
//             })
//             match.$or = [{ $and: firstNameArray }]
//         }
//         if(feesTypeFilter) match.feesType = feesTypeFilter;
//         if(pendingFeesFilter)match.pendingFees = {$gt : 0};
//         console.log(match);
//         // if(blockFilter) match.isBlock = blockFilter;
//         match.isActive = true
//         response = await feesModel.aggregate([
//             { $match: match },
//             {
//                 $lookup: {
//                     from: "standards",
//                     let: { stdId: '$standard' },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ['$_id', '$$stdId'] },
//                                     ],
//                                 },
//                             }
//                         },
//                     ],
//                     as: "standard"
//                 }
//             },
//             {
//                 $unwind : "$standard"
//             },
//             {
//                 $addFields: {
//                     stdName: "$standard.name"  //added for frontend 
//                 }
//             },
//             {
//                 $facet: {
//                     data: [
//                         { $sort: { createdAt: -1 } },
//                         { $skip: (((page as number - 1) * limit as number)) },
//                         { $limit: limit as number },
//                     ],
//                     data_count: [{ $count: "count" }]
//                 }
//             },
//         ])
//         return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('fees'), {
//             fees_data: response[0].data,
//             state: {
//                 page: page as number,
//                 limit: limit as number,
//                 page_limit: Math.ceil(response[0].data_count[0]?.count / (req.body?.limit) as number) || 1,
//             }
//         }, {}))
//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }
//# sourceMappingURL=fees.js.map