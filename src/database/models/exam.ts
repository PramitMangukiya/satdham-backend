const mongoose = require('mongoose')

const examSchema: any = new mongoose.Schema({
    standard : {type : mongoose.Schema.Types.ObjectId , ref : "standard"},
    name :{type : String},
    type : {type : String , enum :["first semester" , "second semester" , "final"  ,"weekly"]},
    isWithPractical :  {type : Boolean},
    timetable : [{
        date :  { type : Date},
        subject : {type : String}
    }],
    isActive : {type : Boolean , default : true}
}, { timestamps: true })

export const examModel = mongoose.model('exam', examSchema);