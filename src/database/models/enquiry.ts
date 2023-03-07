const mongoose = require('mongoose')

const enquirySchema: any = new mongoose.Schema({
    type : {type : Number , enum:[0,1]}, //0-->student , 1--> faculty
    //student 
    name : {type  : String},
    fatherName : { type : String},
    currStandard :  {type : Number},
    applyStandard : { type : Number},
    board : {type : String}, 
    language :  {type : String},

    address : {type : String},
    phoneNumber : { type : String},
    lastYearPercentage :  {type : String},
    referenceStudent : {type : String},


    //faculty
    subject : { type : String},
    preSchool : {type : String},
    experience : {type : String},
    salary : {type : String},
    isActive : {type : Boolean , default : true}

}, { timestamps: true })

export const enquiryModel = mongoose.model('enquiry', enquirySchema);