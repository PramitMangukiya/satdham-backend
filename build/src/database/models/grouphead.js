"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupHeadModel = void 0;
const mongoose = require('mongoose');
const groupHeadSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.groupHeadModel = mongoose.model('grouphead', groupHeadSchema);
//# sourceMappingURL=grouphead.js.map