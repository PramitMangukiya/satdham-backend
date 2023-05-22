import { apiResponse } from "../../common";
import { enquiryModel, groupHeadModel, userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"




export const get_dashboard_data = async(req, res)=> {
    reqInfo(req)
    let body = req.body, match:any ={}
    try{
        let [sec1 , sec2 , sec3] : any = await Promise.all([
            (async() =>
                {
                match.isActive = true
                let totalFacultyEnquiry = await enquiryModel.countDocuments({type: 1, isActive:true}),
                   totalFaculty = await userModel.countDocuments({userType: "faculty", isActive:true})
                let feesData:any = await userModel.aggregate([
                    {$match: match},
                    {
                        $group:{    
                            _id: null,              
                            totalPendingFees: { $sum: '$pendingFees' },
                            totalFees: { $sum: '$totalFees' },
                            totalSalary : {$sum:"$salary"}
                        }
                    }
                ])

                 feesData = {
                    totalPendingFees: feesData[0]?.totalPendingFees || 0,
                    totalFees: feesData[0]?.totalFees || 0,
                    totalSalary: feesData[0]?.totalSalary || 0
                }
                let paidFees = feesData.totalFees -  feesData.totalPendingFees
                return{feesData,totalFacultyEnquiry, totalFaculty, paidFees}
            })(),

            (async()=>{
                let totalStudentEnquiry = await enquiryModel.countDocuments({type: 0, isActive:true})
                let totalStudent = await userModel.countDocuments({userType: "user", isActive:true})
                return {totalStudentEnquiry, totalStudent}
            })(),

            (async()=>{
               let grouphead = await groupHeadModel.aggregate([
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
                        {$project: {_id:0, profilePhoto:1,firstName:1}}
                    ],
                    as: "groupHead"
                }
            },
            {
                $project:{createdAt:0,updatedAt:0, __v:0}
            },
            {
                $unwind : {path:"$user", preserveNullAndEmptyArrays: true}
            },
            ])
            return grouphead
            })()
        ])
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("dashboard"),{sec1, sec2, sec3},{}))
    }catch(error){
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}}
