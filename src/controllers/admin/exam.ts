import { Request, Response } from "express";
import { apiResponse } from "../../common";
import { examModel, userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import { examStudentModel } from "../../database/models/exam_student";

const ObjectId = require('mongoose').Types.ObjectId


export const add_exam = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers;
    try {
        //assign examId and password
        //step1 --> save exam then find all the students of that standard
        //step2 --> for loop for iterating over each student and add them in exam_student schema
        //step3 ---> add  marks array in every document

        //step1
        const exam = await new examModel(body).save();
        console.log(exam._doc , "examData");
        //step2
        const students = await userModel.find({userType : "user" , isActive : true, standard : ObjectId(exam?.standard)});

        //copying timetable into marks
        let marks = [...(exam._doc?.timetable)];

        console.log(marks , "marks format to be saved in db");
        for(let student of students)
        {

            let examStudentEntry  = {
                examId :ObjectId(exam?._id),
                studentId : ObjectId(student?._id),
                marks : marks,
            }
           await new examStudentModel(examStudentEntry).save();
        }
        if(students) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("exam") , exam , {}));
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
                $lookup: {
                    from: "standards",
                    let: { stdId: '$standard' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$stdId'] },
                                    ],
                                },
                            }
                        },
                    ],
                    as: "standard"
                }
            },
            {
                $unwind: "$standard"
            },
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
        const response = await examModel.findOne({ _id : ObjectId(id) , isActive : true}).populate("standard").lean();

            // let registerStudents= await examStudentModel.find({examId : ObjectId(response?._id)})
                                                        // .populate({
                                                        //     path: "studentId",
                                                        //     select: "firstName lastName middleName rollNo class",
                                                        //     as: "student"
                                                        //   });

            // console.log(registerStudents[0] , "student log");
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("exam"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("exam"), response, {}));
        } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}}

export const edit_or_add_exam_marks_of_student = async(req,res) =>
{
    reqInfo(req)
    let { exam } = req.headers,
        body = req.body,
        {examStudentId} = req.body;
    try {
        const response = await examStudentModel.findOneAndUpdate({ _id: ObjectId(examStudentId) }, body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("exam") , {} , {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("exam"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}


export const get_registered_student_by_exam_id = async (req, res) => {
    reqInfo(req)
    let response: any, { examId , classFilter , page, limit, search  } = req.body, match: any = {};
    try {
        if (search){
            var examArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                examArray.push({ name: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: examArray }]
        }
      
        match.examId = ObjectId(examId);
        if(classFilter) match["student.class"] = classFilter;
        response = await examStudentModel.aggregate([
            {
                $lookup : {

                    from : "users",
                    let : {studentId : "$studentId"},
                    pipeline : [
                        {
                            $match : {
                                $expr :{
                                    $and :[
                                        {$eq : ["$_id" ,"$$studentId"]}
                                    ]
                                }
                            }
                        },
                        {
                            $project : {
                                firstName : 1 , 
                                lastName : 1 ,
                                middleName : 1 ,
                                rollNo : 1 ,
                                class : 1 ,
                                phoneNumber : 1 ,
                                profilePhoto  :1
                            }
                        }
                    ],
                    as : "student"
                }
            },
            {
                $unwind : "$student"
            },
            { $match: match },
            {
                $lookup : {
                    from : "exams",
                    let : {examId  :  "$examId"},
                    pipeline : [
                        {
                            $match : {
                                $expr :{
                                    $and : [
                                        {$eq : ["$_id" , "$$examId"]}
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "standards",
                                let: { stdId: '$standard' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$_id', '$$stdId'] },
                                                ],
                                            },
                                        }
                                    },
                                    {$project : {name : 1 , number : 1}}
                                ],
                                as: "standard"
                            }
                        },
                        {
                            $unwind : "$standard"
                        },
                        {
                            $project : {
                                standard : 1 , 
                                name : 1 ,
                                type : 1 ,
                                isWithPractical : 1 ,
                            }
                        }
                    ],
                    as : "exam"
                }
            },
            {
                $unwind : "$exam"
            },
            {
                $project : { studentId : 0 , examId : 0}
            },
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
            registered_students: response[0].data,
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

export const get_by_id_student_exam = async(req,res)=>
{
        reqInfo(req);
        let { exam } = req.headers,
            body = req.body,
          { id } = req.params;
        try {
            const response = await examStudentModel.findOne({ _id : ObjectId(id)}).populate({
                path : "studentId" ,
                select : "firstName lastName middleName rollNo class phone"
            }).lean();

            // let registerStudents= await examStudentModel.find({examId : ObjectId(response?._id)})
                                                        // .populate({
                                                        //     path: "studentId",
                                                        //     select: "firstName lastName middleName rollNo class",
                                                        //     as: "student"
                                                        //   });

            // console.log(registerStudents[0] , "student log");
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("exam"), {}, {}));
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("exam"), response, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}}
