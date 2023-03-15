const mongoose = require('mongoose')

const groupHeadSchema: any = new mongoose.Schema({
    studentId : {type : mongoose.Schema.Types.ObjectId , ref : "user"},
    type : {type : String}, //group head names
    isActive : {type : Boolean , default: true}
}, { timestamps: true })

export const groupHeadModel = mongoose.model('grouphead', groupHeadSchema);