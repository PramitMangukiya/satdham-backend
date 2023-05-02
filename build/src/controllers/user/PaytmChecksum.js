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
exports.PaytmChecksum = void 0;
var crypto = require('crypto');
class PaytmChecksum {
    static encrypt(input, key) {
        var cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv);
        var encrypted = cipher.update(input, 'binary', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    static decrypt(encrypted, key) {
        var decipher = crypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv);
        var decrypted = decipher.update(encrypted, 'base64', 'binary');
        try {
            decrypted += decipher.final('binary');
        }
        catch (e) {
            console.log(e);
        }
        return decrypted;
    }
    static generateSignature(params, key) {
        if (typeof params !== "object" && typeof params !== "string") {
            var error = "string or object expected, " + (typeof params) + " given.";
            return Promise.reject(error);
        }
        if (typeof params !== "string") {
            params = PaytmChecksum.getStringByParams(params);
        }
        return PaytmChecksum.generateSignatureByString(params, key);
    }
    static verifySignature(params, key, checksum) {
        if (typeof params !== "object" && typeof params !== "string") {
            var error = "string or object expected, " + (typeof params) + " given.";
            return Promise.reject(error);
        }
        if (params.hasOwnProperty("CHECKSUMHASH")) {
            delete params.CHECKSUMHASH;
        }
        if (typeof params !== "string") {
            params = PaytmChecksum.getStringByParams(params);
        }
        return PaytmChecksum.verifySignatureByString(params, key, checksum);
    }
    static generateSignatureByString(params, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var salt = yield PaytmChecksum.generateRandomString(4);
            return PaytmChecksum.calculateChecksum(params, key, salt);
        });
    }
    static verifySignatureByString(params, key, checksum) {
        var paytm_hash = PaytmChecksum.decrypt(checksum, key);
        var salt = paytm_hash.substr(paytm_hash.length - 4);
        return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
    }
    static generateRandomString(length) {
        return new Promise(function (resolve, reject) {
            crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
                if (!err) {
                    var salt = buf.toString("base64");
                    resolve(salt);
                }
                else {
                    console.log("error occurred in generateRandomString: " + err);
                    reject(err);
                }
            });
        });
    }
    static getStringByParams(params) {
        var data = {};
        Object.keys(params).sort().forEach(function (key, value) {
            data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
        });
        return Object.values(data).join('|');
    }
    static calculateHash(params, salt) {
        var finalString = params + "|" + salt;
        return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
    }
    static calculateChecksum(params, key, salt) {
        var hashString = PaytmChecksum.calculateHash(params, salt);
        return PaytmChecksum.encrypt(hashString, key);
    }
}
exports.PaytmChecksum = PaytmChecksum;
PaytmChecksum.iv = '@@@@&&&&####$$$$';
module.exports = PaytmChecksum;
//# sourceMappingURL=PaytmChecksum.js.map