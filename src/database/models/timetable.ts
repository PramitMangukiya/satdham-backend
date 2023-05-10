import { standardClass } from "../../common";

const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
    standardId : {type: mongoose.Schema.Types.ObjectId, ref : 'standard'},
    class : {type : String , enum:standardClass},
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

export const timetableModel = mongoose.model('timetable', timetableSchema);