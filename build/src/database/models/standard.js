"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardModel = void 0;
const mongoose = require('mongoose');
const standardSchema = new mongoose.Schema({
    name: { type: String },
    number: { type: Number },
    fees: { type: Number },
    subjects: [{ type: String }],
    features: [
        {
            type: { type: String },
            amount: { type: Number }
        }
    ],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.standardModel = mongoose.model('standard', standardSchema);
//# sourceMappingURL=standard.js.map