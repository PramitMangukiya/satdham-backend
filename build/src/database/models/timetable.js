"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetableModel = void 0;
const common_1 = require("../../common");
const mongoose = require('mongoose');
const timetableSchema = new mongoose.Schema({
    standardId: { type: mongoose.Schema.Types.ObjectId, ref: 'standard' },
    class: { type: String, enum: common_1.standardClass },
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
exports.timetableModel = mongoose.model('timetable', timetableSchema);
//# sourceMappingURL=timetable.js.map