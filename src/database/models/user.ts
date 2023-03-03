const mongoose = require('mongoose')

const userSchema: any = new mongoose.Schema({
    firstName : {type  : String},
    lastName : { type : String},
    middleName :  {type : String},

    email: { type: String, required: true },
    phoneNumber: { type: String},
    password: { type: String },
    profilePhoto : {type : String},
   
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
   
    userType : { type : String , default :"user"}, //faculty , admin , user
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn : { type : Boolean , default : false},

}, { timestamps: true })

export const userModel = mongoose.model('user', userSchema);