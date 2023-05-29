import { Router } from "express";
import { authController, facultyController } from "../controllers";
import { adminJWT } from "../helper";
const router = Router();


router.post("/login",authController.faculty_login)

router.use(adminJWT)
router.post("/edit",facultyController.edit_faculty)
router.post("/get",facultyController.get_faculty)


export const facultyRouter = router