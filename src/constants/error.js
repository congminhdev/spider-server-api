"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Const = require("./const");
exports.EM0001 = 'Fail authentication';
exports.EM0002 = 'You have not permission to call request';
exports.EM0003 = `You have been banned in ${Const.LOGIN_FAIL_EXPIRE_TIME}s, please try later`;
exports.wrongTypeMoreSpec = 'Wrong more spec type';
exports.EM0100 = 'Cannot register user, please try again.';
exports.EM0101 = 'Old password is required';
exports.EM0102 = 'Wrong old password';
exports.EM0103 = 'User not found';
exports.EM0104 = 'Password is required';
exports.EM0105 = `Username must be have length shorter than ${Const.user.maxLenUsername} characters`;
exports.EM0106 = `Username must be have length longer than ${Const.user.minLenUsername} characters`;
exports.EM0107 = `Password must be have length longer than ${Const.user.minLenPassword} characters`;
exports.EM0108 = `Password must be have length shorter than ${Const.user.maxLenPassword} characters`;
exports.EM0109 = `Password must be include: english uppercase characters, lowercase characters, number digits, non-alphabetic characters`;
exports.EM0110 = `Please enter a valid email address`;
exports.EM0111 = `Email has been used`;
exports.EM0112 = `Email is required`;
exports.EM0113 = 'Password reset token is invalid or has expired.';
exports.EM0114 = `Teacher is required`;
exports.EM0115 = `User have not api key`;
exports.EM0601 = 'Can\'t send email. Please try again.';
exports.EM0602 = 'Name must be between 2 and 50 chars long';
exports.EM0603 = 'Name is not required';
exports.EM0604 = 'Email is invalid';
exports.EM0605 = 'Student id is required';
exports.EM0606 = 'Message is required';
exports.EM1201 = 'File extension is not support, please choose another file.';
exports.EM1202 = `Limit file size is ${Const.file.limitSizeUpload} bytes`;
//# sourceMappingURL=error.js.map