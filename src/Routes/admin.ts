"use strict"
import { Router } from 'express'
import {  authController } from '../controllers'
// import { adminJWT } from '../helper'
// import * as validation from '../validation'

const router = Router()


//----------------------- Authentication ------------------------------
// router.post("/signup" , authController.signUp);
router.post("/otp/verify" , authController.otp_verification);
router.post("/login" , authController.login);
router.post("/forget/password" , authController.forgot_password);
router.post("/otp/resend" , authController.resend_otp);
router.post("/reset/password" , authController.reset_password);







// router.use(adminJWT);

export const adminRouter = router
