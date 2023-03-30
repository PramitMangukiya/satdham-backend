import { Request, Response } from "express";
import { apiResponse, generatePassword, generateUserId, getMonthEndDate } from "../../common";
import { attendanceModel, standardModel, userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";

const ObjectId = require('mongoose').Types.ObjectId


export const add_user = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, //{question , options , ans }
        {user} : any = req.headers,
        prefix ; //prefix for user U and for faculty F
    try {
        //assign userId and password
        let userId : any = null , password :any ;
        //if in one class same roll no is present then ?
        if((!body?.userType) || body.userType != "faculty")
        {

            prefix = "U"; //setted prefix as a user
            const isExist = await userModel.findOne({isActive : true , rollNo : body.rollNo ,class : body.class ,userType : "user" , })
            if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Roll no") , {} , {}));

             //(pending)standard pramane fees attach karvani - done
             body.standard = ObjectId(body.standard);
            const standard = await standardModel.findOne({_id: ObjectId(body?.standard) , isActive : true});

            body.installments = standard?.installments
            body.totalFees = standard?.fees || 0;
            body.pendingFees = standard?.fees || 0;
        }
        if(body.userType == "faculty"){
            prefix = "F"; //setted prefix as a user
            const isExist = await userModel.findOne({isActive : true , phoneNumber : body.phoneNumber ,userType : "faculty" , })
            if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Phone number") , {} , {}));
        }

        while(!userId){
            let temp = generateUserId(prefix);
           const copy =  await userModel.findOne({userId : temp , isActive : true ,userType : "user"});
           if(!copy) userId = temp;
        }
        body.userId = userId;
        if(!body.password) body.password = generatePassword();

        const response = await new userModel(body).save();
        if(response) return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("user") , response , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_user_by_id = async(req,res) =>
{
    reqInfo(req)
    let { user } = req.headers,
        body = req.body; //if roll number then must send class
    try {
        const data = await userModel.findOne({_id :ObjectId(body?._id) , isActive : true});
        if(data.userType == "user")
        {
            if(body?.rollNo) {
                let isExist = await userModel.findOne({isActive : true , 
                                                          rollNo : body.rollNo ,
                                                          class : data.class ,
                                                          userType : "user" ,
                                                           _id : {$ne : ObjectId(user?._id)} 
                                                        },{new : true})
    
                console.log(isExist);
                if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Roll no") , {} , {}));
            }
            if(body?.siblings?.length > 0)
            {
                for(let i = 0 ; i < body.siblings.length ; i ++){
                        let item = body.siblings[i];
                        item._id = ObjectId(item._id);
                }
            }
            console.log(body?.siblings , "siblings");
        }

        //(pending)standard change then new  pending fees attach karvani
    
        if(data.userType == "faculty"){
            const isExist = await userModel.findOne({isActive : true , phoneNumber : body.phoneNumber ,userType : "faculty"  })
            if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Phone number") , {} , {}));
        }
      
        const response = await userModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})
        if(!response) return res.status(404).json(new apiResponse(404 , responseMessage?.updateDataError("user") , {} , {}));

        return res.status(200).json(new apiResponse(200, responseMessage.updateDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error);
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
        if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("user"), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_user = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search , userTypeFilter , pendingFeesFilter} = req.body, match: any = {};
    try {
        if (search){
            var firstNameArray: Array<any> = [] ,  lastNameArray: Array<any> = [] , phoneNumberArray: Array<any> = [], 
            userIdArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                firstNameArray.push({ firstName: { $regex: data, $options: 'si' } })
                lastNameArray.push({ lastName: { $regex: data, $options: 'si' } })
                phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } })
                userIdArray.push({ userId: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: firstNameArray }]
        }
        if(userTypeFilter) match.userType = userTypeFilter;
        if(pendingFeesFilter)match.pendingFees = {$gt : 0};

        console.log(match);

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

export const get_user_attendance = async(req,res)=>
{
        reqInfo(req);
        let { user } = req.headers,
            body = req.body,
          { id , monthStartDate} = req.body , match : any = {};
        try {
            let monthEndDate = getMonthEndDate(new Date(monthStartDate));

            // console.log("monthSDate" , new Date(monthStartDate));
            // console.log("monthEDate" , new Date(monthEndDate));

            match.date = {$gte : monthStartDate , $lte : monthEndDate}
            let response = await attendanceModel.find({ ...match, isActive : true});

            const responseAttendance = []; // [ {date , attendance : { guj : true , phy : false }}]
            // response = response?._doc

            // console.log(response);
            for(let day of response){
                
                // console.log(day.date , "date");

                let singleAttendance  = {
                    date : day?.date,
                    attendance : {}
                }

                let attendanceData = day.attendance ;


                //iterating in object called attendanceData
                for(let subject in attendanceData)
                {
                    const allStudentData = attendanceData[subject]; //means [] containing all data
                    //now iterate over that data to find our user and if user is present then send true or false
                    
                        const data = allStudentData.find(item =>
                            item._id = ObjectId(id)
                            )

                            // console.log("studentStatus" , data);
                    // console.log( , "loaded subject");
                    singleAttendance.attendance[subject] = data.attendance

                }
                responseAttendance.push(singleAttendance);
            }
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("user"), responseAttendance, {}));
        } catch (error) {
            console.log(error);
            return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
}
}