"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const helper_1 = require("../helper");
const router = (0, express_1.Router)();
//----------------------- Authentication ------------------------------
// router.post("/signup" , authController.signUp);
router.post("/otp/verify", controllers_1.authController.otp_verification);
router.post("/login", controllers_1.authController.login);
router.post("/forget/password", controllers_1.authController.forgot_password);
router.post("/otp/resend", controllers_1.authController.resend_otp);
router.post("/reset/password", controllers_1.authController.reset_password);
//------------------------ User -----------------------------------------
router.use(helper_1.adminJWT);
router.get("/standard/get/list", controllers_1.adminController.get_standard_list_wo_pagination);
router.post("/user/add", controllers_1.adminController.add_user);
router.post("/user/edit", controllers_1.adminController.edit_user_by_id);
router.delete("/user/delete/:id", controllers_1.adminController.delete_user_by_id);
router.post("/user/get/all", controllers_1.adminController.get_all_user);
router.get("/user/:id", controllers_1.adminController.get_by_id_user);
router.post("/user/attendance", controllers_1.adminController.get_user_attendance);
//------------------------ Enquiry -----------------------------------------
router.post("/enquiry/add", controllers_1.adminController.add_enquiry);
router.post("/enquiry/edit", controllers_1.adminController.edit_enquiry_by_id);
router.delete("/enquiry/delete/:id", controllers_1.adminController.delete_enquiry_by_id);
router.post("/enquiry/get/all", controllers_1.adminController.get_all_enquiry);
router.get("/enquiry/:id", controllers_1.adminController.get_by_id_enquiry);
//------------------------ standard -----------------------------------------
router.post("/standard/add", controllers_1.adminController.add_standard);
router.post("/standard/edit", controllers_1.adminController.edit_standard_by_id);
router.delete("/standard/delete/:id", controllers_1.adminController.delete_standard_by_id);
router.post("/standard/get/all", controllers_1.adminController.get_all_standard);
router.get("/standard/:id", controllers_1.adminController.get_by_id_standard);
//------------------------ attendance -----------------------------------------
router.post("/attendance/add", controllers_1.adminController.add_edit_attendance);
// router.patch("/attendance/edit" , adminController.edit_attendance_by_id);
// router.delete("/attendance/delete/:id" , adminController.delete_attendance_by_id);
router.post("/attendance/get", controllers_1.adminController.get_attendance_by_date_std_subject);
// router.get("/attendance/:id" , adminController.get_by_id_attendance);
//------------------------ Grouphead -----------------------------------------
router.post("/grouphead/add", controllers_1.adminController.add_groupHead);
router.post("/grouphead/edit", controllers_1.adminController.edit_groupHead_by_id);
router.delete("/grouphead/delete/:id", controllers_1.adminController.delete_groupHead_by_id);
router.post("/grouphead/get/all", controllers_1.adminController.get_all_groupHead);
router.get("/grouphead/:id", controllers_1.adminController.get_by_id_groupHead);
//------------------------ canteen -----------------------------------------
router.post("/canteen/add", controllers_1.adminController.add_canteen);
router.post("/canteen/edit", controllers_1.adminController.edit_canteen_by_id);
router.delete("/canteen/delete/:id", controllers_1.adminController.delete_canteen_by_id);
router.post("/canteen/get/all", controllers_1.adminController.get_all_canteen);
router.get("/canteen/:id", controllers_1.adminController.get_by_id_canteen);
//------------------------ transportation -----------------------------------------
router.post("/transportation/add", controllers_1.adminController.add_transportation);
router.post("/transportation/edit", controllers_1.adminController.edit_transportation_by_id);
router.delete("/transportation/delete/:id", controllers_1.adminController.delete_transportation_by_id);
router.post("/transportation/get/all", controllers_1.adminController.get_all_transportation);
router.get("/transportation/:id", controllers_1.adminController.get_by_id_transportation);
//------------------------ Exam -----------------------------------------
router.post("/exam/add", controllers_1.adminController.add_exam);
router.post("/exam/edit", controllers_1.adminController.edit_exam_by_id);
router.delete("/exam/delete/:id", controllers_1.adminController.delete_exam_by_id);
router.post("/exam/get/all", controllers_1.adminController.get_all_exam);
router.get("/exam/:id", controllers_1.adminController.get_by_id_exam);
//----------------------- Marks Entry --------------------------------------
router.post("/exam/marks/edit", controllers_1.adminController.edit_or_add_exam_marks_of_student);
router.post("/exam/get/students/all", controllers_1.adminController.get_registered_student_by_exam_id);
router.get("/exam/marks/:id", controllers_1.adminController.get_by_id_student_exam);
exports.adminRouter = router;
//# sourceMappingURL=admin.js.map