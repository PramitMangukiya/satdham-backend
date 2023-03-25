"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSessionModel = void 0;
var mongoose = require('mongoose');
// import mongoose from 'mongoose'
const userSessionSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    refresh_token: { type: String }
}, { timestamps: true });
exports.userSessionModel = mongoose.model('user_session', userSessionSchema);
//# sourceMappingURL=user_session.js.map