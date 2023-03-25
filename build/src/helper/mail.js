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
exports.admin_sent_all_user_mail = exports.admin_action_bulk_email = exports.send_squadCard_mail = exports.email_verification_mail = exports.forgot_password_mail = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ses = new aws_sdk_1.default.SES();
let mail = process.env.MAIL, password = process.env.PASSWORD;
const option = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: mail,
        clientId: '762064995762-e189v7gj2ekcck7kac3qskj45nana5fi.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04ex04EgqFHu-CgYIARAAGAQSNwF-L9Irwwrrs4QB72k98FIK8lyNJF6eGr2X3WOBm425Z5itsOxFhVLxHPjDhCVBDiSqc0QiR54',
        accessToken: 'ya29.a0AVvZVsrXo10ivbDOa5OTxVPivPm20SITEFjPxGxSbgpzxTsDWGBuQDGnxW64f6C-Tnwi-k2h870AbklSgYOn2wUcLVw4gdUBFY7o1WJSFIJ0qQsYPvnVuv9_323N__jJXBEcjFo0cP2IrkJms2CcdCOiAMQ3Tq4aCgYKAZASAQASFQGbdwaIZi4uG1f5I4yeM5HELoLyoA0166'
    }
};
const transPorter = nodemailer_1.default.createTransport(option);
const forgot_password_mail = (user, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mailOptions = {
                from: mail.MAIL,
                to: user.email,
                subject: "Email verification",
                html: `<html lang="en-US">

                                <head>
                                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                                    <title>Forgot password</title>
                                    <meta name="description" content="Forgot password.">
                                    <style type="text/css">
                                        a:hover {
                                            text-decoration: underline !important;
                                        }
                                    </style>
                                </head>
                                
                                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                                    <!--100% body table-->
                                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                                        <tr>
                                            <td>
                                                <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
                                                    align="center" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="height:80px;">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align:center;">
                                                            <h1
                                                                style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                                SquadCard</h1>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="height:20px;">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                                <tr>
                                                                    <td style="height:40px;">&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:0 35px;">
                                                                        <h1
                                                                            style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                                            Forgot password</h1>
                                                                        <span
                                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                                            Hi ${user.firstName}
                                                                            <br>
                                                                            Someone, hopefully you, has requested to reset the password for your
                                                                            Satdham account.
                                                                            <br>
                                                                            OTP will expire in 10 minutes.
                                                                            <br>
                                                                            Verification code: ${otp}
                                                                            <br>
                                                                            <br>
                                                                            The Satdham Team
                                                                        </p>
                                
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="height:40px;">&nbsp;</td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    <tr>
                                                        <td style="height:20px;">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="text-align:center;">
                                                            <strong></strong></p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="height:80px;">&nbsp;</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!--/100% body table-->
                                </body>
                                
                        </html>`, // html body
            };
            yield transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(`Email has been sent to ${user.email}, kindly follow the instructions`);
                }
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
});
exports.forgot_password_mail = forgot_password_mail;
const email_verification_mail = (user, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mailOptions = {
                from: mail.MAIL,
                to: user.email,
                subject: "Email verification",
                html: `<html lang="en-US">
    
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Email Verification</title>
                    <meta name="description" content="Email Verification.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
    
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <h1
                                                style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                Satdham App</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                            Email Verification</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            Hi ${(user.firstName != null ? user.firstName : 'dear')} ${(user.lastName != null ? user.lastName : '')}, 
                                                            <br>
                                                            Someone, hopefully you, has requested to new account in Satdham app
                                                            <br>
                                                            OTP will expire in 10 minutes.
                                                            <br>
                                                            Verification code: ${otp}
                                                            <br>
                                                            <br>
                                                            The Satdham App Team
                                                        </p>
    
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <strong></strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
    
                </html>`, // html body
            };
            yield transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(`Email has been sent to ${user.email}, kindly follow the instructions`);
                }
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
});
exports.email_verification_mail = email_verification_mail;
const send_squadCard_mail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var params = {
            Destination: {
                ToAddresses: [user.recipientEmail]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en-US">

                        <head>
                            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                            <title>SquadCard</title>
                            <meta name="description" content="SquadCard.">
                            <style type="text/css">
                                a:hover {
                                    text-decoration: underline !important;
                                }
                            </style>
                        </head>
                        
                        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                            <!--100% body table-->
                            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                                <tr>
                                    <td>
                                        <table style="background-color: #f2f3f8; max-width:700px;  margin:0 auto;" width="100%" border="0"
                                            align="center" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="height:80px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:center;">
                                                    <h1
                                                        style="color:#F43939; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                        SquadCard</h1>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:20px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                        style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                        <tr>
                                                            <td style="height:40px;">&nbsp;</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:0 35px;">
                                                                <h1
                                                                    style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                                    SquadCard</h1>
                                                                <span
                                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                                    Hey ${user.recipientName},
                                                                    <br>
                                                                    <br>
                                                                    Use this link to open SquadCard
                                                                    <br>
                                                                    This SquadCard has been sent by ${user.senderOrTeamName} - here it is!
                                                                    <br>
                                                                    <br>
                                                                    <p style="text-align: center; width:100%;">
                                                                    <a style="padding: 8px 15px; background-color: #09D1AA; list-style: none; color: #fff; text-decoration: none; border-radius: 5px;"
                                                                        href=${user.url} title="logo" target="_blank">
                                                                        Open SquadCard
															        </a>
                                                                    </p>
                                                                    <br>
                                                                    If the above link doesn't work for you, here it is again - simply copy and paste it into your browser.
                                                                    <br>
                                                                    <strong>${user.url}</strong>
                                                                    <br>
                                                                    <br>
                                                                    Enjoy!
                                                                    <br>
                                                                    <br>
                                                                    Your friends at SquadCard
                                                                </p>
                        
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="height:40px;">&nbsp;</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            <tr>
                                                <td style="height:20px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:center;">
                                                    <strong></strong></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:80px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!--/100% body table-->
                        </body>
                        
                        </html>
                         `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "SquadCard"
                }
            },
            ReplyToAddresses: [process.env.AWS_REPLY_ADDRESS],
            Source: process.env.AWS_MAIL,
        };
        yield ses.sendEmail(params, function (err, data) {
            if (err) {
                reject(err); // an error occurred
            }
            else {
                resolve(`Email has been sent to ${user.recipientEmail}, kindly follow the instructions`);
            } // successful response
        });
    }));
});
exports.send_squadCard_mail = send_squadCard_mail;
const admin_action_bulk_email = (templateName, userArray, reason, message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let destinationArray = [];
        yield userArray.map(user => {
            destinationArray.push({
                Destination: { ToAddresses: [user === null || user === void 0 ? void 0 : user.email] },
                ReplacementTemplateData: `{ \"fullName\":\"${user === null || user === void 0 ? void 0 : user.fullName}\", \"reason\":\"${reason}\", \"message\":\"${message}\"}`
            });
        });
        var params = {
            Destinations: destinationArray,
            Source: process.env.AWS_MAIL,
            Template: templateName,
            DefaultTemplateData: '{ \"Mukund\":\"Mukund Khunt G.\" }',
            ReplyToAddresses: [process.env.AWS_REPLY_ADDRESS]
        };
        yield ses.sendBulkTemplatedEmail(params, function (err, data) {
            if (err) {
                reject(err); // an error occurred
            }
            else {
                resolve(`Bulk email successfully sent`);
            } // successful response
        });
    }));
});
exports.admin_action_bulk_email = admin_action_bulk_email;
const admin_sent_all_user_mail = (templateName, userArray, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let destinationArray = [];
        yield userArray.map(user => {
            destinationArray.push({
                Destination: { ToAddresses: [user === null || user === void 0 ? void 0 : user.email] },
                ReplacementTemplateData: `{ \"subject\":\"${subject}\", \"message\":\"${message}\" }`
            });
        });
        var params = {
            Destinations: destinationArray,
            Source: process.env.AWS_MAIL,
            Template: templateName,
            DefaultTemplateData: '{ \"Mukund\":\"Mukund Khunt G.\" }',
            ReplyToAddresses: [process.env.AWS_REPLY_ADDRESS]
        };
        yield ses.sendBulkTemplatedEmail(params, function (err, data) {
            if (err) {
                reject(err); // an error occurred
            }
            else {
                resolve(`Bulk all user email successfully sent`);
            } // successful response
        });
    }));
});
exports.admin_sent_all_user_mail = admin_sent_all_user_mail;
//# sourceMappingURL=mail.js.map