import { Router } from "express";
import { authController } from "../controllers";
const router = Router();


router.post("/login",authController.faculty_login)


export const facultyRouter = router