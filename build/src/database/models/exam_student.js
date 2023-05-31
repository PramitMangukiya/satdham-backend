"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examStudentModel = void 0;
// exam_student_id (primary key)
// exam_id (foreign key to the exam table)
// student_id (foreign key to the student table)
// practical_marks (nullable)
// theory_marks (nullable)
const mongoose = require('mongoose');
const examStudentSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exam" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    marks: [{
            date: { type: Date },
            subject: { type: String },
            practicalMarks: { type: Number, default: null },
            theoryMarks: { type: Number, default: null }
        }],
    isExamMarks: { type: Boolean, default: false }
}, { timestamps: true });
exports.examStudentModel = mongoose.model('exam_student', examStudentSchema);
//# sourceMappingURL=exam_student.js.map