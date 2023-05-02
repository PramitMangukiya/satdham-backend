"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    amount: { type: Number },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.orderModel = mongoose.model('order', orderSchema);
//# sourceMappingURL=order.js.map