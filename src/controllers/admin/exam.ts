import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { examModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_exam = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign examId and password
        const response = await new examModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("exam") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_exam_by_id = async(req,res) =>
{
    reqInfo(req)
    let { exam } = req.headers,
        body = req.body; 
    try {
        const response = await examModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("exam") , {} , {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("exam"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_exam_by_id = async(req,res) =>
{
    reqInfo(req)
    let { exam } = req.headers,
        body = req.body,
        {id} = req.params
    try {
       
         const response = await examModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
         if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("exam"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("exam"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_exam = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , examFilter} = req.body, match: any = {};
    try {
        if (search){
            var examArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                examArray.push({ name: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: examArray }]
        }
        // if(examFilter) match.subjectId = ObjectId(examFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await examModel.aggregate([
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('exam'), {
            exam_data: response[0].data,
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

export const get_by_id_exam = async(req,res)=>
{
        reqInfo(req);
        let { exam } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await examModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("exam"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("exam"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}}

