"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryModel = void 0;
const mongoose = require('mongoose');
const enquirySchema = new mongoose.Schema({
    type: { type: Number, enum: [0, 1] },
    //student 
    name: { type: String },
    profilePhoto: { type: String },
    fatherName: { type: String },
    currStandard: { type: Number },
    applyStandard: { type: Number },
    board: { type: String },
    language: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    lastYearPercentage: { type: String },
    referenceStudent: { type: String },
    //faculty
    subject: { type: String },
    preSchool: { type: String },
    experience: { type: String },
    salary: { type: Number },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.enquiryModel = mongoose.model('enquiry', enquirySchema);
//# sourceMappingURL=enquiry.js.map