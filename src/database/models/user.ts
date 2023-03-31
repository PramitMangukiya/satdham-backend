const mongoose = require('mongoose')

const userSchema: any = new mongoose.Schema({

  //----------------------------- User details -------------------------------
    //personal details
    firstName : {type  : String},
    lastName : { type : String},
    middleName :  {type : String},

    aadharCard : { type : String},
    address : {type : String},
    area : {type : String},
    city : {type : String},
    district : {type : String},
    state : {type :String},
    zipCode : {type : String},
    rollNo : {type : Number},
    standard : {type : mongoose.Schema.Types.ObjectId , ref : "standard"},
    class :  {type : String},
    dob : {type : Date},
    bloodGroup : {type :  String},
    preSchool: {type : String},

    email: { type: String },
    phoneNumber: { type: String},
    userId : {type : String},
    password: { type: String },
    profilePhoto : {type : String},

    //parent details
    fatherImage :  { type : String},
    motherImage :  { type : String},
    fatherName : {type : String},
    motherName : {type : String},
    accHolderName : {type : String},
    accNumber : {type : String},
    ifscCode : {type : String},

    //sibling
    siblings : [
    {
      _id : {type :mongoose.Schema.Types.ObjectId , ref : "user" },
     relation : {type : String}
    } 
    ],

    //achievements 
    achievements : [
        {
          name : {type :String},
          description : {type : String},
          certificate : {type : String}
        } 
    ],

    //fees
    totalFees :{type : Number },
    pendingFees : { type : Number},


    //------------------- Faculty Details--------------------------------------------------
    experience : {type : Number},
    salary : {type :Number},
    subject : {type : String},
    reference :  {type :String},
    joiningDate : {type : Date},


    
   //------------------- General Fields ---------------------------------------------------
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
   
    userType : { type : String , default :"user"}, //faculty , admin , user
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn : { type : Boolean , default : false},

}, { timestamps: true })

export const userModel = mongoose.model('user', userSchema);