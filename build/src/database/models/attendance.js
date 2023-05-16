"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceModel = void 0;
const common_1 = require("../../common");
const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    standard: { type: mongoose.Schema.Types.ObjectId, ref: "standard" },
    class: { type: String, enum: common_1.standardClass },
    date: { type: Date },
    attendance: { type: Object },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.attendanceModel = mongoose.model('attendance', attendanceSchema);
//# sourceMappingURL=attendance.js.map