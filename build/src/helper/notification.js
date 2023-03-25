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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification_to_multiple_user = exports.notification_to_user = void 0;
const node_gcm_1 = __importDefault(require("node-gcm"));
const sender = new node_gcm_1.default.Sender(process.env.FCM_KEY);
const notification_to_user = (sender_user_data, data, notification) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (sender_user_data && data && notification && ((_a = sender_user_data === null || sender_user_data === void 0 ? void 0 : sender_user_data.deviceToken) === null || _a === void 0 ? void 0 : _a.length) != 0 && sender_user_data != undefined && sender_user_data != null) {
                let message = new node_gcm_1.default.Message({
                    data: data,
                    notification: notification
                });
                sender.send(message, {
                    registrationTokens: sender_user_data === null || sender_user_data === void 0 ? void 0 : sender_user_data.deviceToken
                }, function (err, response) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                });
            }
            else {
                resolve(true);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.notification_to_user = notification_to_user;
const notification_to_multiple_user = (multiple_user_data, data, notification) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            if (multiple_user_data && data && notification) {
                let deviceToken = [];
                for (let i = 0; i < (multiple_user_data === null || multiple_user_data === void 0 ? void 0 : multiple_user_data.length); i++) {
                    deviceToken.push(...(_b = multiple_user_data[i]) === null || _b === void 0 ? void 0 : _b.deviceToken);
                }
                if (deviceToken.length != 0) {
                    let message = new node_gcm_1.default.Message({
                        data: data,
                        notification: notification
                    });
                    sender.send(message, {
                        registrationTokens: deviceToken
                    }, function (err, response) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(response);
                        }
                    });
                }
                else {
                    resolve(true);
                }
            }
            else {
                resolve(true);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.notification_to_multiple_user = notification_to_multiple_user;
//# sourceMappingURL=notification.js.map