import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { transportationModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_transportation = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign transportationId and password
        const response = await new transportationModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("transportation") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_transportation_by_id = async(req,res) =>
{
    reqInfo(req)
    let { transportation } = req.headers,
        body = req.body; 
    try {
        const response = await transportationModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("transportation") , {} , {}));
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("transportation"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_transportation_by_id = async(req,res) =>
{
    reqInfo(req)
    let { transportation } = req.headers,
        body = req.body,
        {id} = req.params
    try {
        const response = await transportationModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("transportation"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("transportation"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_transportation = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , transportationFilter} = req.body, match: any = {};
    try {
        if (search){
            var driverNameArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                driverNameArray.push({ driver: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: driverNameArray }]
        }
        // if(transportationFilter) match.subjectId = ObjectId(transportationFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await transportationModel.aggregate([
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('transportation'), {
            transportation_data: response[0].data,
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

export const get_by_id_transportation = async(req,res)=>
{
        reqInfo(req);
        let { transportation } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await transportationModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("transportation"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("transportation"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}

