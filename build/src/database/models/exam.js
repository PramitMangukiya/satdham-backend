"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examModel = void 0;
const mongoose = require('mongoose');
const examSchema = new mongoose.Schema({
    standard: { type: mongoose.Schema.Types.ObjectId, ref: "standard" },
    name: { type: String },
    type: { type: String, enum: ["first semester", "second semester", "final", "weekly"] },
    isWithPractical: { type: Boolean },
    timetable: [{
            date: { type: Date },
            subject: { type: String }
        }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.examModel = mongoose.model('exam', examSchema);
//# sourceMappingURL=exam.js.map