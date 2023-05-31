import { Router } from 'express'
import { userController } from '../controllers';
import { userJWT } from '../helper'

const router = Router()




//----------------------- Authentication ------------------------------
router.post("/login" , userController.login);


router.use(userJWT);

//----------------------- Achievement ------------------------------
router.get("/achievement/:id", userController.get_by_id_achievement)


//----------------------- Attandance ------------------------------
router.get("/attendance/:id" , userController.get_by_id_attendance)


//----------------------- transportation ------------------------------
router.get("/transportation/:id", userController.get_by_id_transportation)


//----------------------- Fees ------------------------------
router.get("/fees/history/:id", userController.get_payment_history_by_userId)
router.post("/paytm", userController.paytm)
router.post("/paytm/callback", userController.paytm_callback)
router.get("/paytm/txnstatus", userController.paytm_txnStatus)

//----------------------- Exam ------------------------------
router.get("/exam/:id", userController.get_by_id_exam)

export const userRouter = router