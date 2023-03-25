"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportationModel = void 0;
const mongoose = require('mongoose');
const transportationSchema = new mongoose.Schema({
    busNumber: { type: Number },
    driver: { type: String },
    driverContact: { type: String },
    route: { type: [{ type: String }] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.transportationModel = mongoose.model('transportation', transportationSchema);
//# sourceMappingURL=transportation.js.map