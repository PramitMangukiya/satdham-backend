const mongoose = require('mongoose')

const transportationSchema: any = new mongoose.Schema({
    busNumber : {type : Number },
    driver : { type : String},
    driverContact : {type : String},
    route : {type : [{type:  String}]},
    isActive : {type : Boolean , default : true}
}, { timestamps: true })

export const transportationModel = mongoose.model('transportation', transportationSchema);