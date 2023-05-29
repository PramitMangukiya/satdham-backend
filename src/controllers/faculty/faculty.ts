import { Request, Response } from "express";
import { userModel } from '../../database';
import { reqInfo, responseMessage } from "../../helper";
import { apiResponse } from "../../common";
const ObjectId = require("mongoose").Types.ObjectId

export const edit_faculty = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body,
        {_id , attendance} = req.body,
        {user} : any = req.headers;
  try {
    const response = await userModel.findOneAndUpdate({_id:ObjectId(user._id), isActive : true} , body , {new : true})
    if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("faculty") , {} , {}));
    return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("faculty"), response, {}));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
  }
};

export const get_faculty = async(req, res) =>{
  reqInfo(req)
  let {user} = req.headers
  try{
    const response = await userModel.findOne({_id: ObjectId(user._id), isActive: true, userType:"faculty"})
    if(!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("faculty"),{},{}))
    return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("faculty"),response,{}))
  }catch(error){
    console.log(error);
    return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError,{},error))
  }
}