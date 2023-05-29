"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const helper_1 = require("../helper");
const router = (0, express_1.Router)();
router.post("/login", controllers_1.authController.faculty_login);
router.use(helper_1.adminJWT);
router.post("/edit", controllers_1.facultyController.edit_faculty);
router.post("/get", controllers_1.facultyController.get_faculty);
exports.facultyRouter = router;
//# sourceMappingURL=faculty.js.map