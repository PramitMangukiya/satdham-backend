import {Request, Response } from "express";
import { reqInfo, responseMessage } from "../../helper";
import { apiResponse } from "../../common";
import { timetableModel } from "../../database/models/timetable";
import { standardModel } from "../../database";

const ObjectId = require('mongoose').Types.ObjectId

export const add_edit_timetable =async(req:Request, res : Response) => {
    reqInfo(req)
    let body = req.body, updateTimetable:any, response:any,
    {standardId, timetable}= req.body
    try{
        const standard = await timetableModel.findOne({standardId : body?.standardId, isActive:true})
        if(standard){
            updateTimetable = await timetableModel.findOneAndUpdate({id:ObjectId(standardId),isActive:true},body,{new:true})
            if(!updateTimetable)return res.status(404).json(new apiResponse(404,responseMessage?.updateDataError("timetable"),{},{}))
            return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("timetable"),updateTimetable,{}))
        }
        if(!standard){
            response = await new timetableModel(body).save();
            if(!response)return res.status(404).json(new apiResponse(404,responseMessage?.addDataError,{},{}))
            return res.status(200).json(new apiResponse(200,responseMessage?.addDataSuccess("timetable"),response,{}))
        }
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError,{},error))
    }
}

export const get_by_id_timetable = async(req,res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await timetableModel.findOne({id: ObjectId(body?.id), class:body.class, isActive:true})
        if(!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("timetable"),{},{}))
         return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("timetable"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(200, responseMessage?.internalServerError,{},error))
    }
}