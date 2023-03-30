const mongoose = require('mongoose')

const standardSchema: any = new mongoose.Schema({
    name : {type  : String},
    number : { type : Number},
    fees : {type : Number},
    subjects : [{type : String}],
    
    timetable : {   
        monday : [ //total 8 slot will be there
            {
                subject : {type : String} , 
                faculty :  { type : String},
            }
        ] ,
        tuesday : [ //total 8 slot will be there
            {
                subject : {type : String} , 
                faculty :  { type : String},
            }
        ] ,
        wednesday : [ //total 8 slot will be there
        {
            subject : {type : String} , 
            faculty :  { type : String},
        }
         ] ,
        thursday : [ //total 8 slot will be there
        {
            subject : {type : String} , 
            faculty :  { type : String},
        }
        ] ,
        friday : [ //total 8 slot will be there
        {
            subject : {type : String} , 
            faculty :  { type : String},
        }
        ] ,
        saturday : [ //total 8 slot will be there
        {
            subject : {type : String} , 
            faculty :  { type : String},
        }
        ] ,
    },
    isActive : {type : Boolean , default : true}
}, { timestamps: true })

export const standardModel = mongoose.model('standard', standardSchema);