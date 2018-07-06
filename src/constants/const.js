"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverPrefix = '/api';
exports.LIMIT_RECORD = 25;
exports.FILE_TYPE_IMAGE = '1';
exports.LOGIN_FAIL = 'login-fail';
exports.DISABLE_USER = 'disable-user';
exports.LOGIN_FAIL_EXPIRE_TIME = 60 * 30;
exports.LIMIT_NUMBER_LOGIN_FAIL = 15;
exports.whitelist = ['http://localhost:8080', 'http://103.89.84.55:8080'];
exports.whiteListUrl = [
    `${exports.serverPrefix}/user/login`,
    `${exports.serverPrefix}/user/register`,
    `${exports.serverPrefix}/user/forgot`,
    `${exports.serverPrefix}/api-doc`,
];
exports.user = {
    minLenUsername: 3,
    maxLenUsername: 36,
    minLenPassword: 8,
    maxLenPassword: 25,
};
exports.userRole = [
    {
        id: 1,
        name: 'Admin'
    },
    {
        id: 2,
        name: 'Teacher'
    },
    {
        id: 3,
        name: 'Premium User'
    },
    {
        id: 4,
        name: 'Free User'
    }
];
exports.minio = {
    expiryTime: 24 * 60 * 60 * 7
};
exports.redis = {
    defaultAvatar: 'default_avatar.jpeg',
    expireTime: 60 * 60 * 24 * 7,
    ansKey: 'ANS',
    currentLesson: 'current_lesson'
};
exports.freeUser = {
    redisExpireTime: 60 * 60 * 24
};
exports.selectUserField = ['id', 'username', 'firstName', 'lastName'];
exports.file = {
    fileExtentionSupport: ['jpeg', 'png', 'jpg'],
    limitSizeUpload: 2 * 1000 * 1000,
};
//# sourceMappingURL=const.js.map