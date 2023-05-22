const mongoose = require('mongoose')

const canteenSchema: any = new mongoose.Schema({
    name : {type : String },
    quantity : {type : Number},
    westage: {type : Number},
    unit : { type : String , default : "unit"}, //unit , kg , gm , liter , ml
    isActive : {type : Boolean , default : true}

}, { timestamps: true })

export const canteenModel = mongoose.model('canteen', canteenSchema);