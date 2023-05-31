import { apiResponse } from "../../common";
import { userModel } from "../../database";
import { examStudentModel } from "../../database/models/exam_student";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const get_by_id_exam = async(req, res) =>{
    reqInfo(req)
    let {id}= req.params
    try{
        // const student = await userModel.findById(id).populate('standard').lean();
       
        // if (!student) {
        //     return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('exam'),{},{}));
        // }
    
        const exam = await examStudentModel.find({ studentId: ObjectId(id), isExamMarks: true}).populate('examId', 'standard  name type isWithPractical').lean();
        if(!exam) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound('exam'), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('exam'), exam, {}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}