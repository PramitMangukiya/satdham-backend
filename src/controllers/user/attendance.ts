import { Request, Response } from 'express';
import { attendanceModel, standardModel, userModel } from '../../database';
import { apiResponse, getMonthEndDate, get_next_Date } from '../../common';
import { reqInfo, responseMessage } from '../../helper';
const ObjectId = require("mongoose").Types.ObjectId

export const get_by_id_attendance = async(req,res)=>
{
    reqInfo(req);
    let { id } = req.params,{ _id , monthStartDate} = req.body , match : any = {};

    try {
        const attandance = await attendanceModel.findOne({ _id : ObjectId(id) , isActive : true});
        
        if (!attandance) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("attendance"), {}, {}));

        let monthEndDate = getMonthEndDate(new Date(monthStartDate));
            match.date = {$gte : monthStartDate , $lte : monthEndDate}
            let response = await attendanceModel.find({ ...match, isActive : true});// response array of object
            console.log("response => ", response);
            const responseAttendance = []; 
            
            for(let day of response){
                console.log("day => ", day);
                let singleAttendance  = { // array of object attantande send gujarati, hindi,english
                    date : day?.date,
                    attendance : {}
                }
                console.log("day => ", singleAttendance);
                let attendanceData = day.attendance ;
                console.log("day => ", attendanceData);  //iterating in object called attendanceData
                for(let subject in attendanceData)
                {
                    const allStudentData = attendanceData[subject]; //means [] containing all data
                    //now iterate over that data to find our user and if user is present then send true or false
                    
                        const data = allStudentData.find(item =>
                            item._id = ObjectId(id)
                            )
                    singleAttendance.attendance[subject] = data.attendance
                }
                responseAttendance.push(singleAttendance);
            }
            
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("attendance"), attandance, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

// const getUserID = async (req, res) => {
//     try {
//       const order = await orderModel.findOne({ _id: req.params.orderId });
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }
//       const userId = order.userId;
//       res.status(200).json({ userId });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
  