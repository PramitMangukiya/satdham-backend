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
exports.get_by_id_achievement = void 0;
const database_1 = require("../../database");
const helper_1 = require("../../helper");
const common_1 = require("../../common");
const ObjectId = require("mongoose").Types.ObjectId;
const get_by_id_achievement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { id } = req.params, { page, limit } = req.body;
    try {
        const user = yield database_1.userModel.findOne({ _id: ObjectId(id), isActive: true }, {});
        if (!user)
            return res.status(400).json(new common_1.apiResponse(400, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataNotFound("user"), {}, {}));
        const achievements = user.achievements;
        const startIndex = (page - 1) * limit;
        const paginatedAchievements = yield database_1.userModel
            .find({ _id: ObjectId(id), isActive: true })
            .select('achievements')
            .slice('achievements', [startIndex, startIndex + limit])
            .sort({ createdAt: -1 });
        const Count = achievements.length;
        return res.status(200).json(new common_1.apiResponse(200, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.getDataSuccess("achievement"), {
            achievements: paginatedAchievements[0].achievements, state: {
                page,
                limit,
                page_limit: Math.ceil(Count / limit) || 1
            },
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, helper_1.responseMessage === null || helper_1.responseMessage === void 0 ? void 0 : helper_1.responseMessage.internalServerError, {}, error));
    }
});
exports.get_by_id_achievement = get_by_id_achievement;
//# sourceMappingURL=achievement.js.map