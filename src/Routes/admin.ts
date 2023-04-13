"use strict"
import { Router } from 'express'
import {  adminController, authController } from '../controllers'
import { adminJWT } from '../helper'

const router = Router()


//----------------------- Authentication ------------------------------
// router.post("/signup" , authController.signUp);
router.post("/otp/verify" , authController.otp_verification);
router.post("/login" , authController.login);
router.post("/forget/password" , authController.forgot_password);
router.post("/otp/resend" , authController.resend_otp);
router.post("/reset/password" , authController.reset_password);

//------------------------ User -----------------------------------------
router.use(adminJWT);
router.get("/standard/get/list" , adminController.get_standard_list_wo_pagination);
router.post("/user/add" , adminController.add_user);
router.post("/user/edit" , adminController.edit_user_by_id);
router.delete("/user/delete/:id" , adminController.delete_user_by_id);
router.post("/user/get/all" , adminController.get_all_user);
router.get("/user/:id" , adminController.get_by_id_user);
router.post("/user/attendance" , adminController.get_user_attendance)
router.post("/faculty/get/all" , adminController.get_all_faculty);


//------------------------ Enquiry -----------------------------------------
router.post("/enquiry/add" , adminController.add_enquiry);
router.post("/enquiry/edit" , adminController.edit_enquiry_by_id);
router.delete("/enquiry/delete/:id" , adminController.delete_enquiry_by_id);
router.post("/enquiry/get/all" , adminController.get_all_enquiry);
router.get("/enquiry/:id" , adminController.get_by_id_enquiry);

//------------------------ standard -----------------------------------------
router.post("/standard/add" , adminController.add_standard);
router.post("/standard/edit" , adminController.edit_standard_by_id);
router.delete("/standard/delete/:id" , adminController.delete_standard_by_id);
router.post("/standard/get/all" , adminController.get_all_standard);
router.get("/standard/:id" , adminController.get_by_id_standard);

//------------------------ attendance -----------------------------------------
router.post("/attendance/add" , adminController.add_edit_attendance);
// router.patch("/attendance/edit" , adminController.edit_attendance_by_id);
// router.delete("/attendance/delete/:id" , adminController.delete_attendance_by_id);
router.post("/attendance/get" , adminController.get_attendance_by_date_std_subject);
// router.get("/attendance/:id" , adminController.get_by_id_attendance);

//------------------------ Grouphead -----------------------------------------
router.post("/grouphead/add" , adminController.add_groupHead);
router.post("/grouphead/edit" , adminController.edit_groupHead_by_id);
router.delete("/grouphead/delete/:id" , adminController.delete_groupHead_by_id);
router.post("/grouphead/get/all" , adminController.get_all_groupHead);
router.get("/grouphead/:id" , adminController.get_by_id_groupHead);

//------------------------ canteen -----------------------------------------
router.post("/canteen/add" , adminController.add_canteen);
router.post("/canteen/edit" , adminController.edit_canteen_by_id);
router.delete("/canteen/delete/:id" , adminController.delete_canteen_by_id);
router.post("/canteen/get/all" , adminController.get_all_canteen);
router.get("/canteen/:id" , adminController.get_by_id_canteen);

//------------------------ transportation -----------------------------------------
router.post("/transportation/add" , adminController.add_transportation);
router.post("/transportation/edit" , adminController.edit_transportation_by_id);
router.delete("/transportation/delete/:id" , adminController.delete_transportation_by_id);
router.post("/transportation/get/all" , adminController.get_all_transportation);
router.get("/transportation/:id" , adminController.get_by_id_transportation);

//------------------------ Exam -----------------------------------------
router.post("/exam/add" , adminController.add_exam);
router.post("/exam/edit" , adminController.edit_exam_by_id);
router.delete("/exam/delete/:id" , adminController.delete_exam_by_id);
router.post("/exam/get/all" , adminController.get_all_exam);
router.get("/exam/:id" , adminController.get_by_id_exam);
//----------------------- Marks Entry --------------------------------------
router.post("/exam/marks/edit" , adminController.edit_or_add_exam_marks_of_student);
router.post("/exam/get/students/all" , adminController.get_registered_student_by_exam_id);
router.get("/exam/marks/:id" , adminController.get_by_id_student_exam);



export const adminRouter = router
