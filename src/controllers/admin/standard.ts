import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { standardModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_standard = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign standardId and password
        const response = await new standardModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("standard") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_standard_by_id = async(req,res) =>
{
    reqInfo(req)
    let { standard } = req.headers,
        body = req.body; 
    try {
        const response = await standardModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("standard") , {} , {}));
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("standard"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_standard_by_id = async(req,res) =>
{
    reqInfo(req)
    let { standard } = req.headers,
        body = req.body,
        {id} = req.params
    try {
        const response = await standardModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("standard"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("standard"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_standard = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , standardFilter} = req.body, match: any = {};
    try {
        if (search){
            var standardArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                standardArray.push({ name: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: standardArray }]
        }
        // if(standardFilter) match.subjectId = ObjectId(standardFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await standardModel.aggregate([
            { $match: match },
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('standard'), {
            standard_data: response[0].data,
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

export const get_by_id_standard = async(req,res)=>
{
        reqInfo(req);
        let { standard } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await standardModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("standard"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("standard"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}

export const get_standard_list_wo_pagination = async (req, res) => {
    reqInfo(req)
    let response: any, {} = req.body, match: any = {};
    try {
      
        let standardList = await standardModel.find({isActive : true}).select("number name");
        return res.status(200).json(new apiResponse(200 , responseMessage?.getDataSuccess("standardList") , standardList , {}));
         
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}