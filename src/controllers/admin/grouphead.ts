import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { groupHeadModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_groupHead = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign groupHeadId and password
        body.studentId = ObjectId(body.studentId);
        const response = await new groupHeadModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("groupHead") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_groupHead_by_id = async(req,res) =>
{
    reqInfo(req)
    let { groupHead } = req.headers,
        body = req.body; 
    try {
        const response = await groupHeadModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("groupHead") , {} , {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("groupHead"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_groupHead_by_id = async(req,res) =>
{
    reqInfo(req)
    let { groupHead } = req.headers,
        body = req.body,
        {id} = req.params
    try {
        const response = await groupHeadModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("groupHead"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("groupHead"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_groupHead = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , groupHeadFilter} = req.body, match: any = {}, matchAtLast : any = {};
    try {
        if (search){
            var groupHeadArray: Array<any> = [], firstNameArray:Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                groupHeadArray.push({ type: { $regex: data, $options: 'si' } })
                firstNameArray.push({ "user.firstName": { $regex: data, $options: 'si' } })            
            })
            matchAtLast.$or = [{ $and: groupHeadArray }, { $and: firstNameArray }]
        }
        // if(groupHeadFilter) match.subjectId = ObjectId(groupHeadFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await groupHeadModel.aggregate([
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
                                    {$project: {name:1, number:1}}
                                ],
                                as: "standard"
                            }
                        },
                        {
                            $unwind : {path:"$standard", preserveNullAndEmptyArrays: true}
                        },
                    ],
                    as: "user"
                }
            },
            {
                $unwind : {path:"$user", preserveNullAndEmptyArrays: true}
                    
            },
            {$match: matchAtLast},
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('groupHead'), {
            groupHead_data: response[0].data,
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

export const get_by_id_groupHead = async(req,res)=>
{
        reqInfo(req);
        let { groupHead } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await groupHeadModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("groupHead"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("groupHead"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}

