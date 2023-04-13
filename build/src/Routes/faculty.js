"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/login", controllers_1.authController.faculty_login);
exports.facultyRouter = router;
//# sourceMappingURL=faculty.js.map