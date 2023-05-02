"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const helper_1 = require("../helper");
const router = (0, express_1.Router)();
//----------------------- Authentication ------------------------------
router.post("/login", controllers_1.userController.login);
router.use(helper_1.userJWT);
//----------------------- Achievement ------------------------------
router.get("/achievement/:id", controllers_1.userController.get_by_id_achievement);
//----------------------- Attandance ------------------------------
router.get("/attendance/:id", controllers_1.userController.get_by_id_attendance);
//----------------------- transportation ------------------------------
router.get("/transportation/:id", controllers_1.userController.get_by_id_transportation);
//----------------------- Fees ------------------------------
router.get("/fees/history/:id", controllers_1.userController.get_payment_history_by_userId);
router.post("/paytm", controllers_1.userController.paytm);
router.post("/paytm/callback", controllers_1.userController.paytm_callback);
router.get("/paytm/txnstatus", controllers_1.userController.paytm_txnStatus);
exports.userRouter = router;
//# sourceMappingURL=user.js.map