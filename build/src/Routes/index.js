"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
// import { userRouter } from './user'
const common_1 = require("../common");
const admin_1 = require("./admin");
const upload_1 = require("./upload");
const faculty_1 = require("./faculty");
// import { userRouter } from './user'
const router = (0, express_1.Router)();
exports.router = router;
const accessControl = (req, res, next) => {
    req.headers.userType = common_1.userStatus[req.originalUrl.split('/')[1]];
    next();
};
console.log("hiii");
router.use("/upload", accessControl, upload_1.uploadRouter);
router.use('/admin', accessControl, admin_1.adminRouter);
router.use('/faculty', accessControl, faculty_1.facultyRouter);
console.log("hiii");
//# sourceMappingURL=index.js.map