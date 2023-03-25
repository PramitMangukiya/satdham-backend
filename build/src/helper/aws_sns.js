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
exports.sendSMS = exports.sendSMSTest = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
// // const params = {
// //     attributes: { DefaultSMSType: 'Transactional', DefaultSenderID: 'PVR pristine' },
// // }
// // const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:081890807861:PVR_pristine';
// const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:680146243022:zazzi_sns'
// export const sendSMS = async (countryCode: any, number: any, SMS_template: any) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (countryCode && number) {
//                 number = `+${countryCode} ${number}`
//                 await sns.subscribe(
//                     {
//                         Protocol: 'SMS',
//                         TopicArn: SNS_TOPIC_ARN,
//                         Endpoint: number,
//                     },
//                     async function (error, data) {
//                         if (error) {
//                             console.log('Error in subscribe');
//                             console.log(error);
//                         }
//                         var params = {
//                             Message: SMS_template,
//                             PhoneNumber: number,
//                             MessageAttributes: {
//                                 'AWS.SNS.SMS.SMSType': {
//                                     DataType: 'String',
//                                     StringValue: 'Transactional',
//                                 },
//                                 'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'abc' }
//                             }
//                         };
//                         await sns.publish(params, function (err_publish, data) {
//                             if (err_publish) {
//                                 console.log(err_publish);
//                                 reject(err_publish);
//                             } else {
//                                 resolve(data);
//                             }
//                         });
//                     }
//                 );
//             }
//             else {
//                 resolve(true)
//             }
//         } catch (error) {
//             reject(error)
//         }
//     });
// }
const sendSMSTest = (countryCode, number, SMS_template) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (countryCode && number) {
                number = `+${countryCode} ${number}`;
                var params = {
                    Message: SMS_template,
                    PhoneNumber: number,
                };
                var publishTextPromise = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                publishTextPromise.then(function (data) {
                    console.log("MessageID is " + data.MessageId);
                }).catch(function (err) {
                    console.error(err, err.stack);
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
exports.sendSMSTest = sendSMSTest;
const sns = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' });
const SNS_TOPIC_ARN = 'arn:aws:sns:ap-south-1:081890807861:zazzi';
const sendSMS = (countryCode, number, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            number = `+ ${countryCode} ${number}`;
            console.log(number);
            yield sns.subscribe({
                Protocol: 'SMS',
                TopicArn: SNS_TOPIC_ARN,
                Endpoint: number,
            }, function (error, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log('Error in subscribe');
                        // console.log(error);
                    }
                    var params = {
                        Message: otp,
                        PhoneNumber: number,
                        MessageAttributes: {
                            'AWS.SNS.SMS.SMSType': {
                                DataType: 'String',
                                StringValue: 'Transactional',
                            },
                            'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'DeathFolder' }
                        }
                    };
                    // console.log('params:', params);
                    yield sns.publish(params, function (err_publish, data) {
                        if (err_publish) {
                            // console.log(err_publish);
                            reject(err_publish);
                        }
                        else {
                            // console.log(data);
                            resolve(data);
                        }
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
});
exports.sendSMS = sendSMS;
//# sourceMappingURL=aws_sns.js.map