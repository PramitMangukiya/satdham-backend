import { Request, Response } from "express";
import { apiResponse, generatePassword, generateUserId } from "../../common";
import { userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_user = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        body.createdBy = ObjectId(user._id);
        //assign userId and password
        let userId : any = null , password :any ;
        while(!userId){
            let temp = generateUserId();
           const copy =  await userModel.findOne({userId : temp , isActive : true ,userType : "user"});
           if(!copy) userId = temp;
        }
        body.userId = userId;
        body.password = generatePassword();
        
        const response = await new userModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("user") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_user_by_id = async(req,res) =>
{
    reqInfo(req)
    let { user } = req.headers,
        body = req.body //{id , changeField}
    try {
        const response = await userModel.findOneAndUpdate({_id :ObjectId(body.id) , isActive : true} , body , {new : true})
        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("user"), response, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_user_by_id = async(req,res) =>
{
    reqInfo(req)
    let { user } = req.headers,
        body = req.body,
        {id} = req.params
    try {
        const response = await userModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("user"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_user = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , userFilter} = req.body, match: any = {};
    try {
        if (search) {
            var userArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                userArray.push({ userLine: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: userArray }]
        }
        if(userFilter) match.subjectId = ObjectId(userFilter);
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        response = await userModel.aggregate([
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('user'), {
            user_data: response[0].data,
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

export const get_by_id_user = async(req,res)=>
{
        reqInfo(req);
        let { user } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await userModel.findOne({ _id : ObjectId(id) , isActive : true});
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("user"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}

