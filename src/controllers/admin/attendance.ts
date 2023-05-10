import { Request, Response } from "express";
import { apiResponse, get_next_Date } from "../../common";
import { attendanceModel, standardModel, userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_edit_attendance = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, 
        {_id , attendance} = req.body,
        {user} : any = req.headers; //{_id , attendance}
    try {

        const updatedAttendance = await attendanceModel.findOneAndUpdate({_id : ObjectId(_id) , isActive : true} , body , {new : true})
        if(updatedAttendance) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("attendance") , updatedAttendance , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

// export const edit_attendance_by_id = async(req,res) =>
// {
//     reqInfo(req)
//     let { attendance } = req.headers,
//         body = req.body; 
//     try {
//         const response = await attendanceModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
//         return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("attendance"), response, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }

// export const delete_attendance_by_id = async(req,res) =>
// {
//     reqInfo(req)
//     let { attendance } = req.headers,
//         body = req.body,
//         {id} = req.params
//     try {
//         const response = await attendanceModel.findOneAndUpdate({_id :ObjectId(id) , isActive : true} , {isActive : false} , {new : true})
//         return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("attendance"), {}, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }

export const get_attendance_by_date_std_subject = async (req, res) => {
    reqInfo(req)
    let response: any, { standard , date , subject} = req.body, match: any = {};
    try {
        match.isActive = true
        match.date = { $gt : get_next_Date(new Date(date) , -1), $lte : new Date(date) };
        match.standard = ObjectId(standard);
        
        let attendance = await attendanceModel.findOne({...match})
        if(!attendance)
        {
            //then make new attendance entry in that 
            let standardData = await standardModel.findOne({_id : ObjectId(standard) , isActive : true});

            let studentData = await userModel.find({isActive : true , userType : "user" , standard : ObjectId(standard)});
            let responseStudentData  : any = [];
            for(let i = 0 ; i < studentData?.length ; i++)
            {
                    let student = studentData[i];
                    // console.log(student);
                     student = {
                        _id : ObjectId(student?._id),
                        rollNo : student?.rollNo,
                        name: `${student?.firstName} ${student?.lastName}`,
                        attendance : null
                    }
                        // student.attendance = null;
                        responseStudentData.push(student);
            }
            
            console.log(studentData[0]?.attendance , "is field attendance");
            // console.log("student Data" , studentData);
        

            let subjects = standardData.subjects;//take out subject from timetableModel(std id and class)
            // console.log(subjects);
            let preAttendance : any = {};

            for(let i = 0 ; i < subjects?.length ; i ++)
            {
                    let item = subjects[i];
                    preAttendance[`${item}`] = [...responseStudentData];
            }

            let new_attendance = {
                standard : ObjectId(standard),
                date : new Date(date),
                attendance : preAttendance
            }
            const attendanceData = await new attendanceModel(new_attendance).save()

            console.log(attendanceData , "attendanceData");
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("attendance"), attendanceData, {}));
        }

        return res.status(200).json(new apiResponse(200 , responseMessage?.getDataSuccess("attendance") , attendance , {}));
    }catch(error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}


// export const get_by_id_attendance = async(req,res)=>
// {
//         reqInfo(req);
//         let { attendance } = req.headers,
//             body = req.body,
//           { id } = req.params;
//         try {
//             const response = await attendanceModel.findOne({ _id : ObjectId(id) , isActive : true});
//             if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("attendance"), {}, {}));
    
//             return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("attendance"), response, {}));
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
// }
// }

