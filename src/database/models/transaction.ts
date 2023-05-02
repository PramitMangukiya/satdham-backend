const mongoose = require('mongoose')

const transactionSchema: any = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref : "user"},
    feesDetails: [
        {
            feeName : {type : String},
            amount : {type : Number}
        }
    ],
    totalAmount : {type : Number},
    type : {type : String, enum:["offline","online"], default: "offline"},
    isActive : {type : Boolean , default : true}

}, { timestamps: true })

export const transactionModel = mongoose.model('transaction', transactionSchema);

