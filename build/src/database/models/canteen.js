"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canteenModel = void 0;
const mongoose = require('mongoose');
const canteenSchema = new mongoose.Schema({
    name: { type: String },
    quantity: { type: Number },
    westage: { type: Number },
    unit: { type: String, default: "unit" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.canteenModel = mongoose.model('canteen', canteenSchema);
//# sourceMappingURL=canteen.js.map