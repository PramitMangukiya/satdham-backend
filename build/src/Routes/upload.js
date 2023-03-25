"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const jwt_1 = require("../helper/jwt");
const s3_1 = require("../helper/s3");
const common_1 = require("../common");
const router = (0, express_1.Router)();
const file_type = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!common_1.file_path.includes(req.params.file))
        return res.status(400).json(new common_1.apiResponse(400, 'invalid file type', { action: common_1.file_path }, {}));
    next();
});
//---------------------- Authentication ---------------------------------------  
router.use(jwt_1.uploadJWT);
router.post('/compress/:file', file_type, s3_1.compress_image.single('image'), s3_1.image_compress_response);
router.post('/:file', file_type, s3_1.uploadS3.single('image'), s3_1.image_compress_response);
//------------------------ Delete -------------------------------
router.delete('/delete_file/:folder-:type-:file-:name', s3_1.delete_file);
exports.uploadRouter = router;
//# sourceMappingURL=upload.js.map