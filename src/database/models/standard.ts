const mongoose = require('mongoose')

const standardSchema: any = new mongoose.Schema({
    name : {type  : String},
    number : { type : Number},
    fees : {type : Number},
    subjects : [{type : String}],

    features : [
        {
            type :  {type : String} ,
            amount :  { type : Number}
        }
    ],
    isActive : {type : Boolean , default : true}
}, { timestamps: true })

export const standardModel = mongoose.model('standard', standardSchema);