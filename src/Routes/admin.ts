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
router.post("/user/add" , adminController.add_user);
router.patch("/user/edit" , adminController.edit_user_by_id);
router.delete("/user/delete/:id" , adminController.delete_user_by_id);
router.post("/user/get/all" , adminController.get_all_user);
router.get("/user/:id" , adminController.get_by_id_user);

//------------------------ Enquiry -----------------------------------------
router.post("/enquiry/add" , adminController.add_enquiry);
router.patch("/enquiry/edit" , adminController.edit_enquiry_by_id);
router.delete("/enquiry/delete/:id" , adminController.delete_enquiry_by_id);
router.post("/enquiry/get/all" , adminController.get_all_enquiry);
router.get("/enquiry/:id" , adminController.get_by_id_enquiry);







// router.use(adminJWT);

export const adminRouter = router
