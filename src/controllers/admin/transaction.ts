import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { transactionModel } from "../../database/models/transaction";
import { reqInfo, responseMessage } from "../../helper";
import { userModel } from "../../database";
import { error } from "console";
const ObjectId: any = require("mongoose").Types.ObjectId

export const add_offline_fees = async (req: Request, res: Response) => {
    reqInfo(req);
    let {userId, feesDetails, totalAmount} = req.body, 
    body = req.body,
    { user} = req.headers
    console.log("Id => ",userId);
    try {
      if(totalAmount <= 0)return res.status(405).json(new apiResponse(405,"Invalid total amount",{},{}))
      //step 0 check pendig fees first
      //step 1 transactionModel data add
      //step 2 usermodel pending fees update

      //step 0 
      let userData = await userModel.findOne({_id : ObjectId(userId) ,pendingFees : {$gte : totalAmount}  })
  
      if(!userData)   return res.status(400).json(new apiResponse(400, "Total amount should be less than pending fees", {}, {}))

      const response = await transactionModel.create({userId: ObjectId(userId), feesDetails : feesDetails, totalAmount: totalAmount ,isActive: true,});

      // console.log("feeDetails => ",feeDetails);
      await userModel.findOneAndUpdate(
                  {_id: ObjectId(userId)},
                  {
                    $inc: {
                        pendingFees: -totalAmount,
                    },
                  }
                );
        console.log("transaction => ",response);
        
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("fees") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

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

export const get_all_transactions =async (req, res) => {
  reqInfo(req)
  let response :any ,{search,classFilter,page,limit,standardFilter} = req.body,match : any = {},matchAtLast : any = {}
 try{

  if(search){
      var firstNameArray: Array<any> = [], lastNameArray: Array<any> = [], middleNameArray: Array<any> = [], 
      rollNumberArray: Array<any> = [], stdArray: Array<any> = [],  classArray: Array<any> = [];
      search = search.split(" ");
      search.forEach(data => {
      firstNameArray.push({ "user.firstName": { $regex: data, $options: 'si' } })
      lastNameArray.push({ "user.lastName": { $regex: data, $options: 'si' } })
      middleNameArray.push({ "user.middleName": { $regex: data, $options: 'si' } })
      rollNumberArray.push({ "user.rollNo": { $regex: data, $options: 'si' } })
    })
    matchAtLast.$or = [{ $and: firstNameArray },{ $and: lastNameArray },{ $and: middleNameArray },{ $and: firstNameArray },{ $and: rollNumberArray },]
  }
  
  if(standardFilter?.length > 0){
    // for (let i = 0; i < standardFilter.length; i++) {
    //     const standardFi = standardFilter[i];
    //     standardFilter[i] = ObjectId(standardFi);
    //   }
    matchAtLast["standard.name"] = { $in: standardFilter }
} 
if(classFilter?.length > 0)match.class = { $in: classFilter };

  match.isActive = true
  console.log("match ", match , "match2" , matchAtLast);
  response = await transactionModel.aggregate([
    { $match: match },
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
                  $project : {firstName : 1 , lastName : 1 , middleName : 1 , rollNo : 1 , standard : 1 , class : 1  , profilePhoto : 1 }
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
                          {$project : {name : 1 , number : 1}}
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

    { $match: matchAtLast },

  {
      $facet: {
          data: [
              { $sort: { createdAt: -1 } },
              { $skip: (((page as number - 1) * limit as number)) },
              { $limit: limit as number },
          ],
          data_count: [{ $count: "count" }]
      }
  },
    ])
    return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('paid fees details'), {
      paid_fees: response[0].data,
      state: {
          page: page as number,
          limit: limit as number,
          page_limit: Math.ceil(response[0].data_count[0]?.count / (req.body?.limit) as number) || 1,
      }
  }, {}))
} catch (error) {
  return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}







