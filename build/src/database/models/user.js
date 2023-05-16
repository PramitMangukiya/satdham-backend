"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const common_1 = require("../../common");
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    //----------------------------- User details -------------------------------
    //Student personal details
    profilePhoto: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    dob: { type: Date },
    age: { type: String },
    dobVillage: { type: String },
    dobTaluka: { type: String },
    dobDist: { type: String },
    dobState: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    nationality: { type: String },
    cast: { type: String },
    category: { type: String },
    bloodGroup: { type: String },
    motherTougue: { type: String },
    aadharCard: { type: String },
    isSingleChild: { type: Boolean },
    isInEws: { type: Boolean },
    //Residential Address
    address: { type: String },
    area: { type: String },
    city: { type: String },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    zipCode: { type: String },
    rollNo: { type: String },
    standard: { type: mongoose.Schema.Types.ObjectId, ref: "standard" },
    class: { type: String, enum: common_1.standardClass },
    email: { type: String },
    phoneNumber: { type: String },
    userId: { type: String },
    password: { type: String },
    //--------------------------parent details---------------------
    accNumber: { type: String },
    accHolderName: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    swiftCode: { type: String },
    //father's Details
    fatherImage: { type: String },
    fatherName: { type: String },
    fatherDob: { type: String },
    fatherQualification: { type: String },
    fatherOccupation: { type: String },
    fatherOfficeAddress: { type: String },
    fatherIncome: { type: String },
    fatherAadharCard: { type: String },
    fatherEmail: { type: String },
    fatherPhone: { type: String },
    //mother's Details
    motherImage: { type: String },
    motherName: { type: String },
    motherDob: { type: String },
    motherQualification: { type: String },
    motherOccupation: { type: String },
    motherOfficeAddress: { type: String },
    motherIncome: { type: String },
    motherAadharCard: { type: String },
    motherEmail: { type: String },
    motherPhone: { type: String },
    //student Medical Examination
    regOfMedicalOfficer: { type: String },
    sealOfMedicalInstitution: { type: String },
    //Previous school Details(if any)
    preSchool: { type: String },
    preClassStudyIn: { type: String },
    preSchoolAffliationNumber: { type: String },
    preSchoolCode: { type: String },
    preDiseCode: { type: String },
    preMedium: { type: String },
    prelcNumber: { type: String },
    preBoard: { type: String },
    //sibling
    siblings: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            relation: { type: String },
        }
    ],
    //achievements 
    achievements: [
        {
            date: { type: Date },
            name: { type: String },
            description: { type: String },
            certificate: { type: String }
        }
    ],
    //fees
    totalFees: { type: Number },
    pendingFees: { type: Number },
    //------------------- Faculty Details--------------------------------------------------
    experience: { type: Number },
    salary: { type: Number },
    subject: { type: String },
    reference: { type: String },
    joiningDate: { type: Date },
    //------------------- General Fields ---------------------------------------------------
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    userType: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    deviceToken: { type: Array, default: [] }
}, { timestamps: true });
exports.userModel = mongoose.model('user', userSchema);
//# sourceMappingURL=user.js.map