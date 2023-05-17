import { Request, Response } from "express";
import { apiResponse, generatePassword, generateUserId, getMonthEndDate, standardClass } from "../../common";
import { attendanceModel, standardModel, userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import { number } from "joi";

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
            if(!standardClass.includes(body.class)) return res.status(405).json(new apiResponse(405, "Invalid class",{},{}))
            prefix = "U"; //setted prefix as a user
            const isExist = await userModel.findOne({isActive : true ,standard : ObjectId(body?.standard) , rollNo : body.rollNo ,class : body.class ,userType : "user" , })
            if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Roll no") , {} , {}));

             //(pending)standard pramane fees attach karvani - done
             body.standard = ObjectId(body.standard);
            const standard = await standardModel.findOne({_id: ObjectId(body?.standard) , isActive : true});

            // body.installments = standard?.installments
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
            if(body?.class) {
                if(!standardClass.includes(body.class)) return res.status(405).json(new apiResponse(405, "Invalid class",{},{}))
                let isExist = await userModel.findOne({isActive : true , 
                                                          rollNo : data.rollNo ,
                                                          class : body.class ,
                                                          userType : "user" ,
                                                           _id : {$ne : ObjectId(user?._id)} 
                                                        },{new : true})
    
                console.log(isExist);
                if(isExist) return res.status(404).json(new apiResponse(404 , `Student with same roll number existing in class${body.class}` , {} , {}));
            }
            console.log(body?.siblings , "siblings");
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
            const isExist = await userModel.findOne({isActive : true , phoneNumber : body.phoneNumber ,_id:{$ne:ObjectId(body._id)},userType : "faculty"  })
            if(isExist) return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Phone number") , {} , {}));
        }
      
        const response = await userModel.findOneAndUpdate({_id :ObjectId(body._id) , isActive : true} , body , {new : true})

        console.log(response.siblings, "updated siblings");
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
    let response: any, { page, limit, search , userTypeFilter , pendingFeesFilter, classFilter,cityFilter, areaFilter, countryFilter, standardFilter,
         stateFilter, districtFilter,zipCodeFilter} = req.body, match: any = {}, matchAtLast:any={};
    try {
        if (search){
            var nameArray: Array<any>=[], lastNameArray: Array<any> = [], middleNameArray: Array<any> = [], userIdArray: Array<any> = [],
            phoneNumberArray: Array<any> = [], standardArray: Array<any> = [], classArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                nameArray.push({firstName: {$regex: data, $options:'si'}}),
                lastNameArray.push({lastName: {$regex: data, $options:'si'}}),
                middleNameArray.push({middleName: {$regex: data, $options:'si'}}),
                phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } }),
                userIdArray.push({ userId: { $regex: data, $options: 'si' }})
            })
            
            match.$or = [{ $and: nameArray },{ $and: lastNameArray }, {$and: middleNameArray}, { $and: phoneNumberArray }, 
                        {$and: standardArray}, {$and: classArray}, {$and : userIdArray}]
        }

    
        
        if(userTypeFilter) match.userType = { $regex: userTypeFilter, $options: 'si' };
        if(pendingFeesFilter)match.pendingFees = {$gte : pendingFeesFilter.min, $lte: pendingFeesFilter.max};
        if(standardFilter?.length > 0){
            for (let i = 0; i < standardFilter.length; i++) {
                const standardFi = standardFilter[i];
                standardFilter[i] = ObjectId(standardFi);
              }
            match.standard = { $in: standardFilter }
        } 
        if(classFilter?.length > 0)match.class = { $in: classFilter };
        if(areaFilter) match.area = { $regex: areaFilter, $options: 'si' }
        if(cityFilter) match.city = { $regex: cityFilter, $options: 'si' }
        if(countryFilter) match.country = { $regex: countryFilter, $options: 'si' }
        if(districtFilter) match.district = { $regex: districtFilter, $options: 'si' }
        if(stateFilter) match.state = { $regex: stateFilter, $options: 'si' }
        if(zipCodeFilter) match.zipCode = { $regex: zipCodeFilter, $options: 'si' }

        // if(blockFilter) match.isBlock = blockFilter;
        console.log("match ", match);
        match.isActive = true
        response = await userModel.aggregate([
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
                $unwind : "$standard"
            },
            {
                $addFields: {
                    stdName: "$standard.name"  //added for frontend 
                }
            },
            { $match: matchAtLast },
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
        // console.log(standard);
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('user'), {
            user_data: response[0].data,
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

export const get_by_id_user = async(req,res)=>
{
        reqInfo(req);
        let { user } = req.headers,
            body = req.body,
          { id } = req.params,
          match : any = {};
        try {
            // const response = await userModel.findOne({ _id : ObjectId(id) , isActive : true}).populate("siblings._id");

            match._id  = ObjectId(id)
            match.isActive =  true;
           const response = await userModel.aggregate([
                { $match: match },
                {
                    $lookup: {
                        from: "users",
                        let: { siblingIds: '$siblings._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ["$_id", "$$siblingIds"] }
                                        ],
                                    },
                                },
                            },
                            {
                                $project :  {
                                    firstName : 1 ,
                                    lastName : 1 ,
                                    middleName : 1 ,
                                    profilePhoto : 1 ,
                                    standard : 1,
                                    phoneNumber : 1,
                                    email : 1 ,
                                    class : 1,
                                    rollNo :  1,
                                    address : 1,
                                }
                            }
                        ],
                        as: "sibs" ,
                        
                    }
                },
                {
                    $addFields: {
                      siblings: {
                        $map: {
                          input: "$siblings",
                          as: "sibling",
                          in: {
                            $mergeObjects: [
                              {
                                $arrayElemAt: [
                                  {
                                    $filter: {
                                      input: "$sibs",
                                      cond: {
                                        $eq: ["$$this._id", "$$sibling._id"],
                                      },
                                    },
                                  },
                                  0,
                                ],
                              },
                              { relation: "$$sibling.relation" },
                            ],
                          },
                        },
                      },
                    },
                  },
    
            ])
            if (!response) return res.status(400).json(new apiResponse(400, responseMessage.getDataNotFound("user"), {}, {}));
    
            return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess("user"), response[0], {}));
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
            let response = await attendanceModel.find({ ...match, isActive : true}).lean();

            const responseAttendance = []; // [ {date , attendance : { guj : true , phy : false }}]
            // response = response?._doc

            // console.log(response);
            for(let day of response){ //each day attendance
                
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
                    console.log("object" , allStudentData);

                    for(let item of allStudentData)
                    {
                        if(item._id.toString() == id.toString())
                        singleAttendance.attendance[subject] = item.attendance

                    }
                    //     const data = allStudentData.find(item =>
                    //         item._id = ObjectId(id)
                    //         )

                    // // console.log("studentStatus" , data);
                    // // console.log( , "loaded subject");
                    // singleAttendance.attendance[subject] = data.attendance

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

export const get_all_faculty = async (req, res) => {
    reqInfo(req)
    let response: any, { page, limit, search,subjectFilter  } = req.body, match: any = {};
    try {
        if (search){
            var firstNameArray: Array<any> = [] ,  lastNameArray: Array<any> = [] , phoneNumberArray: Array<any> = [], 
            subjectArray: Array<any> = [], userIdArray: Array<any> = [], standardArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                firstNameArray.push({ firstName: { $regex: data, $options: 'si' } }),
                lastNameArray.push({ lastName: { $regex: data, $options: 'si' } }),
                phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } }),
                userIdArray.push({ userId: { $regex: data, $options: 'si' } }),
                subjectArray.push({subject:{ $regex: data, $options: 'si' } }),
                standardArray.push({subject:{ $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: firstNameArray }, { $and: lastNameArray }, { $and: phoneNumberArray }, { $and: userIdArray }, 
                { $and: subjectArray }, { $and: standardArray }]
        }

        console.log(match);
        if(subjectFilter) match.subject = {$regex: subjectFilter, $options: 'si'};
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true
        match.userType  = "faculty"
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
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('faculty'), {
            faculty_data: response[0].data,
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


export const add_student_in_bulk = async (req: Request, res: Response) => {
    reqInfo(req);
    let { students } = req.body, //{question , options , ans }
        body = req.body ,
        {user} : any = req.headers,
        prefix ; //prefix for user U and for faculty F
    try {

        let addedDataCount = 0 ,
         skippedDataCount = 0 ,
         skippedData = []
        for(let individual of students)
        {
                //assign userId and password
                let userId : any = null , password :any ;
            
                //if standard is number then we have to fetch standard here from standard number
                let standardData = await standardModel.findOne({isActive : true  , number : individual.standard});
                if(!standardData) {
                    skippedDataCount ++ ;
                    skippedData.push( { ...individual , reason :"Standard does not exist! please add standard first!"} );
                    continue;
                }
                //if standard is number then we have to fetch standard here from standard number
                let hasValidClass =  standardClass.includes(individual.class)

                if(!hasValidClass) {
                    skippedDataCount ++ ;
                    skippedData.push( { ...individual , reason :`Class does not exist! please add please add valid class, class can be: ${standardClass}!`} );
                    continue;
                }

                prefix = "U"; //setted prefix as a user
                const isExist = await userModel.findOne({isActive : true ,standard : ObjectId(standardData) , rollNo : individual.rollNo ,class : individual.class ,userType : "user"  })
                if(isExist) {
                    skippedDataCount ++ ;
                    skippedData.push( { ...individual , reason :"Student with same roll no and class exist!"} );
                    continue;
                }
                // return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Roll no") , {} , {}));

                //(pending)standard pramane fees attach karvani - done
                individual.standard = ObjectId(standardData?._id);
                // const standard = await standardModel.findOne({_id: ObjectId(individual?.standard) , isActive : true});

                // individual.installments = standard?.installments
                individual.totalFees = standardData?.fees || 0;
                individual.pendingFees = standardData?.fees || 0;
                individual.rollNo = Number(individual.rollNo)
    
                while(!userId){
                    let temp = generateUserId(prefix);
                const copy =  await userModel.findOne({userId : temp , isActive : true ,userType : "user"});
                if(!copy) userId = temp;
                }
                individual.userId = userId;
                if(!individual.password) individual.password = generatePassword();

                const response = await new userModel(individual).save();
                addedDataCount++;
        }   
        
         return res.status(200).json(new apiResponse(200 , responseMessage?.addDataSuccess("students") , {totalData : students.length ,addedDataCount ,skippedDataCount , skippedData} , {}));
         return res.status(400).json(new apiResponse(400, responseMessage?.addDataError, {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}