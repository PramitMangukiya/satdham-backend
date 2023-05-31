// exam_student_id (primary key)
// exam_id (foreign key to the exam table)
// student_id (foreign key to the student table)
// practical_marks (nullable)
// theory_marks (nullable)
const mongoose = require('mongoose')

const examStudentSchema: any = new mongoose.Schema({
    examId :{type : mongoose.Schema.Types.ObjectId , ref : "exam"},
    studentId : {type : mongoose.Schema.Types.ObjectId , ref : "user"},
    marks : [{
        date :  { type : Date},
        subject : {type : String},
        practicalMarks : { type : Number , default : null},
        theoryMarks : {type: Number , default : null}
    }],
   isExamMarks: {type: Boolean, default: false}
}, { timestamps: true })

export const examStudentModel = mongoose.model('exam_student', examStudentSchema);