
import { transportationModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import { apiResponse } from "../../common";
const ObjectId = require("mongoose").Types.ObjectId


export const get_by_id_transportation = async(req,res)=>
{
    reqInfo(req);
    let response:any, { id } = req.params,
        {page,limit}= req.body;
    try {
        const user = await transportationModel.findOne({ _id : ObjectId(id) , isActive : true});
        if (!user) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("transportation"), {}, {}));
        response = await transportationModel.aggregate([
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('achivement'), {
            user,
            state: {
                page: page as number,
                limit: limit as number,
                page_limit: Math.ceil(response[0].data_count[0]?.count / (req.body?.limit) as number) || 1,
            }
        }, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}