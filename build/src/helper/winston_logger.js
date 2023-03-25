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
exports.reqInfo = exports.logger = void 0;
/**
 * @author Arpit  Nakarani
 */
const winston_1 = __importDefault(require("winston"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const timeFormat = (0, moment_timezone_1.default)().format('DD-MM-YYYY hh:mm:ss A');
const colorizer = winston_1.default.format.colorize();
const timeZone = "Asia/Calcutta";
let logColor = {
    colors: {
        error: "red",
        warn: "magenta",
        info: "yellow",
        http: "green",
        debug: "cyan"
    }
}, name = "Satdham";
winston_1.default.addColors(logColor);
let alignColorsAndTime = winston_1.default.format.combine(winston_1.default.format.colorize({
    all: true
}), winston_1.default.format.timestamp({
    format: timeFormat
}), winston_1.default.format.json(), winston_1.default.format.printf(info => `\x1b[96m[${name}]` + " " + `\x1b[95m${moment_timezone_1.default.tz(timeZone)}` + " " + colorizer.colorize(winston_1.default.level, `- ${info.level}: ${info.message}`)));
let fileLogger = winston_1.default.format.combine(winston_1.default.format.timestamp({
    format: timeFormat
}), winston_1.default.format.json(), winston_1.default.format.printf(info => `${info.timestamp}  ${info.level} : ${info.message}`));
exports.logger = winston_1.default.createLogger({
    level: "debug",
    transports: [
        new winston_1.default.transports.Http({
            level: 'warn',
            format: winston_1.default.format.json()
        }),
        new (winston_1.default.transports.Console)({
            format: alignColorsAndTime,
        })
    ],
});
const reqInfo = function (req) {
    return __awaiter(this, void 0, void 0, function* () {
        let splitResult = req.header('user-agent').split("(").toString().split(")");
        let browserName = splitResult[splitResult.length - 1];
        splitResult = splitResult[0].split(",");
        let osName = splitResult[1];
        exports.logger.http(`${req.method} ${req.headers.host}${req.originalUrl} \x1b[33m device os => [${osName}] \x1b[1m\x1b[37mip address => ${req.ip} \n\x1b[36m browser => ${browserName}`);
    });
};
exports.reqInfo = reqInfo;
//# sourceMappingURL=winston_logger.js.map