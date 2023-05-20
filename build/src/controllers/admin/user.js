"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_student_in_bulk = exports.get_all_faculty = exports.get_user_attendance = exports.get_by_id_user = exports.get_all_user = exports.delete_user_by_id = exports.edit_user_by_id = exports.add_user = void 0;
const common_1 = require("../../common");
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const ObjectId = require('mongoose').Types.ObjectId;
const add_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, //{question , options , ans }
    { user } = req.headers, prefix; //prefix for user U and for faculty F
    try {
        //assign userId and password
        let userId = null, password;
        //if in one class same roll no is present then ?
        if ((!(body === null || body === void 0 ? void 0 : body.userType)) || body.userType != "faculty") {
            if (!common_1.standardClass.includes(body.class))
                return res.status(405).json(new common_1.apiResponse(405, "Invalid class", {}, {}));
            prefix = "U"; //setted prefix as a user
            const isExist = yield database_1.userModel.findOne({ isActive: true, standard: ObjectId(body === null || body === void 0 ? void 0 : body.standard), rollNo: body.rollNo, class: body.class, userType: "user", });
            if (isExist)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.dataAlreadyExist("Roll no"), {}, {}));
            //(pending)standard pramane fees attach karvani - done
            body.standard = ObjectId(body.standard);
            const standard = yield database_1.standardModel.findOne({ _id: ObjectId(body === null || body === void 0 ? void 0 : body.standard), isActive: true });
            // body.installments = standard?.installments
            body.totalFees = (standard === null || standard === void 0 ? void 0 : standard.fees) || 0;
            body.pendingFees = (standard === null || standard === void 0 ? void 0 : standard.fees) || 0;
        }
        if (body.userType == "faculty") {
            prefix = "F"; //setted prefix as a user
            const isExist = yield database_1.userModel.findOne({ isActive: true, phoneNumber: body.phoneNumber, userType: "faculty", });
            if (isExist)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.dataAlreadyExist("Phone number"), {}, {}));
        }
        while (!userId) {
            let temp = (0, common_1.generateUserId)(prefix);
            const copy = yield database_1.userModel.findOne({ userId: temp, isActive: true, userType: "user" });
            if (!copy)
                userId = temp;
        }
        body.userId = userId;
        if (!body.password)
            body.password = (0, common_1.generatePassword)();
        const response = yield new database_1.userModel(body).save();
        if (response)
            return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("user"), response, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_user = add_user;
const edit_user_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body; //if roll number then must send class
    try {
        const data = yield database_1.userModel.findOne({ _id: ObjectId(body === null || body === void 0 ? void 0 : body._id), isActive: true });
        if (data.userType == "user") {
            if (body === null || body === void 0 ? void 0 : body.rollNo) {
                let isExist = yield database_1.userModel.findOne({ isActive: true,
                    rollNo: body.rollNo,
                    class: data.class,
                    userType: "user",
                    _id: { $ne: ObjectId(data._id) }
                }, { new: true });
                console.log(isExist);
                if (isExist)
                    return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.dataAlreadyExist("Roll no"), {}, {}));
            }
            if (body === null || body === void 0 ? void 0 : body.class) {
                if (!common_1.standardClass.includes(body.class))
                    return res.status(405).json(new common_1.apiResponse(405, "Invalid class", {}, {}));
                let isExist = yield database_1.userModel.findOne({ isActive: true,
                    rollNo: data.rollNo,
                    class: body.class,
                    userType: "user",
                    _id: { $ne: ObjectId(data._id) }
                }, { new: true });
                console.log(isExist);
                if (isExist)
                    return res.status(404).json(new common_1.apiResponse(404, `Student with same roll number existing in class${body.class}`, {}, {}));
            }
            console.log(body === null || body === void 0 ? void 0 : body.siblings, "siblings");
            if (((_a = body === null || body === void 0 ? void 0 : body.siblings) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (let i = 0; i < body.siblings.length; i++) {
                    let item = body.siblings[i];
                    item._id = ObjectId(item._id);
                }
            }
            console.log(body === null || body === void 0 ? void 0 : body.siblings, "siblings");
        }
        //(pending)standard change then new  pending fees attach karvani
        if (data.userType == "faculty") {
            const isExist = yield database_1.userModel.findOne({ isActive: true, phoneNumber: body.phoneNumber, _id: { $ne: ObjectId(body._id) }, userType: "faculty" });
            if (isExist)
                return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.dataAlreadyExist("Phone number"), {}, {}));
        }
        const response = yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(body._id), isActive: true }, body, { new: true });
        console.log(response.siblings, "updated siblings");
        if (!response)
            return res.status(404).json(new common_1.apiResponse(404, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.updateDataError("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.updateDataSuccess("user"), response, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.edit_user_by_id = edit_user_by_id;
const delete_user_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body, { id } = req.params;
    try {
        const response = yield database_1.userModel.findOneAndUpdate({ _id: ObjectId(id), isActive: true }, { isActive: false }, { new: true });
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.deleteDataSuccess("user"), {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.delete_user_by_id = delete_user_by_id;
const get_all_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    (0, helper_1.reqInfo)(req);
    let response, { page, limit, search, userTypeFilter, pendingFeesFilter, classFilter, cityFilter, areaFilter, countryFilter, standardFilter, stateFilter, districtFilter, zipCodeFilter } = req.body, match = {}, matchAtLast = {};
    try {
        if (search) {
            var nameArray = [], lastNameArray = [], middleNameArray = [], userIdArray = [], phoneNumberArray = [];
            // standardArray: Array<any> = [], classArray: Array<any> = []
            search = search.split(" ");
            search.forEach(data => {
                nameArray.push({ firstName: { $regex: data, $options: 'si' } }),
                    lastNameArray.push({ lastName: { $regex: data, $options: 'si' } }),
                    middleNameArray.push({ middleName: { $regex: data, $options: 'si' } }),
                    phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } }),
                    userIdArray.push({ userId: { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: nameArray }, { $and: lastNameArray }, { $and: middleNameArray }, { $and: phoneNumberArray },
                { $and: userIdArray }];
        }
        if (userTypeFilter)
            match.userType = { $regex: userTypeFilter, $options: 'si' };
        if (pendingFeesFilter)
            match.pendingFees = { $gte: pendingFeesFilter.min, $lte: pendingFeesFilter.max };
        if ((standardFilter === null || standardFilter === void 0 ? void 0 : standardFilter.length) > 0) {
            // for (let i = 0; i < standardFilter.length; i++) {
            //     const standardFi = standardFilter[i];
            //     standardFilter[i] = ObjectId(standardFi);
            //   }
            matchAtLast["standard.name"] = { $in: standardFilter };
        }
        if ((classFilter === null || classFilter === void 0 ? void 0 : classFilter.length) > 0)
            match.class = { $in: classFilter };
        if (areaFilter)
            match.area = { $regex: areaFilter, $options: 'si' };
        if (cityFilter)
            match.city = { $regex: cityFilter, $options: 'si' };
        if (countryFilter)
            match.country = { $regex: countryFilter, $options: 'si' };
        if (districtFilter)
            match.district = { $regex: districtFilter, $options: 'si' };
        if (stateFilter)
            match.state = { $regex: stateFilter, $options: 'si' };
        if (zipCodeFilter)
            match.zipCode = { $regex: zipCodeFilter, $options: 'si' };
        // if(blockFilter) match.isBlock = blockFilter;
        console.log("match ", match, "match2", matchAtLast);
        match.isActive = true;
        response = yield database_1.userModel.aggregate([
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
                $addFields: {
                    stdName: "$standard.name" //added for frontend 
                }
            },
            { $match: matchAtLast },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        // console.log(standard);
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('user'), {
            user_data: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_b = response[0].data_count[0]) === null || _b === void 0 ? void 0 : _b.count) / ((_c = req.body) === null || _c === void 0 ? void 0 : _c.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_all_user = get_all_user;
const get_by_id_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body, { id } = req.params, match = {};
    try {
        // const response = await userModel.findOne({ _id : ObjectId(id) , isActive : true}).populate("siblings._id");
        match._id = ObjectId(id);
        match.isActive = true;
        const response = yield database_1.userModel.aggregate([
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
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                middleName: 1,
                                profilePhoto: 1,
                                standard: 1,
                                phoneNumber: 1,
                                email: 1,
                                class: 1,
                                rollNo: 1,
                                address: 1,
                            }
                        }
                    ],
                    as: "sibs",
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
        ]);
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("user"), response[0], {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_user = get_by_id_user;
const get_user_attendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { user } = req.headers, body = req.body, { id, monthStartDate } = req.body, match = {};
    try {
        let monthEndDate = (0, common_1.getMonthEndDate)(new Date(monthStartDate));
        // console.log("monthSDate" , new Date(monthStartDate));
        // console.log("monthEDate" , new Date(monthEndDate));
        match.date = { $gte: monthStartDate, $lte: monthEndDate };
        let response = yield database_1.attendanceModel.find(Object.assign(Object.assign({}, match), { isActive: true })).lean();
        const responseAttendance = []; // [ {date , attendance : { guj : true , phy : false }}]
        // response = response?._doc
        // console.log(response);
        for (let day of response) { //each day attendance
            // console.log(day.date , "date");
            let singleAttendance = {
                date: day === null || day === void 0 ? void 0 : day.date,
                attendance: {}
            };
            let attendanceData = day.attendance;
            //iterating in object called attendanceData
            for (let subject in attendanceData) {
                const allStudentData = attendanceData[subject]; //means [] containing all data
                //now iterate over that data to find our user and if user is present then send true or false
                console.log("object", allStudentData);
                for (let item of allStudentData) {
                    if (item._id.toString() == id.toString())
                        singleAttendance.attendance[subject] = item.attendance;
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
        if (!response)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage.getDataSuccess("user"), responseAttendance, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_user_attendance = get_user_attendance;
const get_all_faculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    (0, helper_1.reqInfo)(req);
    let response, { page, limit, search, subjectFilter } = req.body, match = {};
    try {
        if (search) {
            var firstNameArray = [], lastNameArray = [], phoneNumberArray = [], subjectArray = [], userIdArray = [], standardArray = [];
            search = search.split(" ");
            search.forEach(data => {
                firstNameArray.push({ firstName: { $regex: data, $options: 'si' } }),
                    lastNameArray.push({ lastName: { $regex: data, $options: 'si' } }),
                    phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } }),
                    userIdArray.push({ userId: { $regex: data, $options: 'si' } }),
                    subjectArray.push({ subject: { $regex: data, $options: 'si' } }),
                    standardArray.push({ subject: { $regex: data, $options: 'si' } });
            });
            match.$or = [{ $and: firstNameArray }, { $and: lastNameArray }, { $and: phoneNumberArray }, { $and: userIdArray },
                { $and: subjectArray }, { $and: standardArray }];
        }
        console.log(match);
        if (subjectFilter)
            match.subject = { $regex: subjectFilter, $options: 'si' };
        // if(blockFilter) match.isBlock = blockFilter;
        match.isActive = true;
        match.userType = "faculty";
        response = yield database_1.userModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    data_count: [{ $count: "count" }]
                }
            },
        ]);
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess('faculty'), {
            faculty_data: response[0].data,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(((_d = response[0].data_count[0]) === null || _d === void 0 ? void 0 : _d.count) / ((_e = req.body) === null || _e === void 0 ? void 0 : _e.limit)) || 1,
            }
        }, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_all_faculty = get_all_faculty;
const add_student_in_bulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { students } = req.body, //{question , options , ans }
    body = req.body, { user } = req.headers, prefix; //prefix for user U and for faculty F
    try {
        let addedDataCount = 0, skippedDataCount = 0, skippedData = [];
        for (let individual of students) {
            //assign userId and password
            let userId = null, password;
            //if standard is number then we have to fetch standard here from standard number
            let standardData = yield database_1.standardModel.findOne({ isActive: true, number: individual.standard });
            if (!standardData) {
                skippedDataCount++;
                skippedData.push(Object.assign(Object.assign({}, individual), { reason: "Standard does not exist! please add standard first!" }));
                continue;
            }
            //if standard is number then we have to fetch standard here from standard number
            let hasValidClass = common_1.standardClass.includes(individual.class);
            if (!hasValidClass) {
                skippedDataCount++;
                skippedData.push(Object.assign(Object.assign({}, individual), { reason: `Class does not exist! please add please add valid class, class can be: ${common_1.standardClass}!` }));
                continue;
            }
            prefix = "U"; //setted prefix as a user
            const isExist = yield database_1.userModel.findOne({ isActive: true, standard: ObjectId(standardData), rollNo: individual.rollNo, class: individual.class, userType: "user" });
            if (isExist) {
                skippedDataCount++;
                skippedData.push(Object.assign(Object.assign({}, individual), { reason: "Student with same roll no and class exist!" }));
                continue;
            }
            // return res.status(404).json(new apiResponse(404 , responseMessage?.dataAlreadyExist("Roll no") , {} , {}));
            //(pending)standard pramane fees attach karvani - done
            individual.standard = ObjectId(standardData === null || standardData === void 0 ? void 0 : standardData._id);
            // const standard = await standardModel.findOne({_id: ObjectId(individual?.standard) , isActive : true});
            // individual.installments = standard?.installments
            individual.totalFees = (standardData === null || standardData === void 0 ? void 0 : standardData.fees) || 0;
            individual.pendingFees = (standardData === null || standardData === void 0 ? void 0 : standardData.fees) || 0;
            individual.rollNo = Number(individual.rollNo);
            while (!userId) {
                let temp = (0, common_1.generateUserId)(prefix);
                const copy = yield database_1.userModel.findOne({ userId: temp, isActive: true, userType: "user" });
                if (!copy)
                    userId = temp;
            }
            individual.userId = userId;
            if (!individual.password)
                individual.password = (0, common_1.generatePassword)();
            const response = yield new database_1.userModel(individual).save();
            addedDataCount++;
        }
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataSuccess("students"), { totalData: students.length, addedDataCount, skippedDataCount, skippedData }, {}));
        return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.addDataError, {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.add_student_in_bulk = add_student_in_bulk;
//# sourceMappingURL=user.js.map