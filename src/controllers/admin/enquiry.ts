import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { enquiryModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_enquiry = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign enquiryId and password
        const response = await new enquiryModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("enquiry") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_enquiry_by_id = async(req,res) =>
{
    reqInfo(req)
    let { enquiry } = req.headers,
        body = req.body; 
    try {
        const response = await enquiryModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("enquiry") , {} , {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("enquiry"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_enquiry_by_id = async(req,res) =>
{
    reqInfo(req)
    let { enquiry } = req.headers,
        body = req.body,
        {id} = req.params
    try {
       
         const response = await enquiryModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
         if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("enquiry"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("enquiry"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_enquiry = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , userType, boardFilter, applyStandardFilter,lastYearPercentageFilter, subjectFilter,languageFilter,experienceFilter} = req.body, match: any = {};
    try {
        if (search){
            var  fatherNameArray:Array<any> = [], nameArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                // fullNameArray.push({$or:[{ name: { $regex: data, $options: 'si' } }, { fatherName: { $regex: data, $options: 'si' } }]})
                nameArray.push({ name: { $regex: data, $options: 'si' } }),
                fatherNameArray.push({ fatherName: { $regex: data, $options: 'si'}})
            })
            match.$or = [{ $and: nameArray },{ $and: fatherNameArray } ]
        }
        if(userType || (userType == 0)) match.type = userType;
        if(boardFilter) match.board = {$regex: boardFilter, $options: 'si'};;
        if(applyStandardFilter) match.applyStandard = {$regex: applyStandardFilter, $options: 'si'};
        if(lastYearPercentageFilter) match.lastYearPercentage = {$regex: lastYearPercentageFilter, $options: 'si'};
        if(languageFilter) match.language = {$regex: languageFilter, $options: 'si'};
        if(experienceFilter) match.experience = {$regex: experienceFilter, $options: 'si'};
        if(subjectFilter) match.subject = {$regex: subjectFilter, $options: 'si'};
        match.isActive = true
        console.log("match" , match);
        response = await enquiryModel.aggregate([
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('enquiry'), {
            enquiry_data: response[0].data,
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

export const get_by_id_enquiry = async(req,res)=>
{
        reqInfo(req);
        let { enquiry } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await enquiryModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("enquiry"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("enquiry"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}

