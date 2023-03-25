"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_next_Date = exports.generatePassword = exports.generateUserId = exports.file_path = exports.userStatus = exports.apiResponse = void 0;
class apiResponse {
    constructor(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.apiResponse = apiResponse;
exports.userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
};
exports.file_path = ['profile', 'document'];
const generateUserId = (prefix) => {
    const randomInt = Math.floor(Math.random() * 100000); // Generate a random integer between 0 and 99999
    const userId = `${prefix}${randomInt.toString().padStart(5, '0')}`; // Combine the random integer with the prefix "u-" and pad with leading zeros
    return userId;
};
exports.generateUserId = generateUserId;
const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Define the possible characters for the password
    let password = '';
    for (let i = 0; i < 5; i++) { // Generate a random password of length 5
        const randomIndex = Math.floor(Math.random() * characters.length); // Generate a random index within the range of the characters array
        password += characters[randomIndex]; // Add a random character from the characters array to the password
    }
    return password;
};
exports.generatePassword = generatePassword;
const get_next_Date = (date, day) => {
    const nextDate = new Date(date); // The Date object returns today's timestamp
    nextDate.setDate(nextDate.getDate() + day);
    return nextDate;
};
exports.get_next_Date = get_next_Date;
//# sourceMappingURL=index.js.map