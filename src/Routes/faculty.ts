import { Router } from "express";
import { authController, facultyController } from "../controllers";
const router = Router();


router.post("/login",authController.faculty_login)


router.post("/edit",facultyController.edit_faculty)


export const facultyRouter = router