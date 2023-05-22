const mongoose = require('mongoose')

const orderSchema: any = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref : 'user'},
    amount : {type : Number},
    status : {type : String, enum:["pending", "success", "failed"], default:"pending"},
    isActive : {type : Boolean , default : true}
}, { timestamps: true })

export const    orderModel = mongoose.model('order', orderSchema);