"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardModel = void 0;
const mongoose = require('mongoose');
const standardSchema = new mongoose.Schema({
    name: { type: String },
    number: { type: Number },
    fees: { type: Number },
    subjects: [{ type: String }],
    timetable: {
        monday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
        tuesday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
        wednesday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
        thursday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
        friday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
        saturday: [
            {
                subject: { type: String },
                faculty: { type: String },
            }
        ],
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.standardModel = mongoose.model('standard', standardSchema);
//# sourceMappingURL=standard.js.map