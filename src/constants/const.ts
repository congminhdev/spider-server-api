export const serverPrefix = "/api";

export const port = 3000;

export const LIMIT_RECORD = 25;
export const FILE_TYPE_IMAGE = "1";
export const LOGIN_FAIL = "login-fail";
export const DISABLE_USER = "disable-user";
export const LOGIN_FAIL_EXPIRE_TIME = 60 * 30;
export const LIMIT_NUMBER_LOGIN_FAIL = 15;

export const whitelist = ["http://localhost:8080", "http://103.89.84.55:8080"];
export const whiteListUrl = [`${serverPrefix}/user/login`, `${serverPrefix}/user/register`, `${serverPrefix}/user/forgot`, `${serverPrefix}/api-doc`];

export const user = {
    minLenUsername: 3,
    maxLenUsername: 36,
    minLenPassword: 8,
    maxLenPassword: 25
};

export const userRole = [
    {
        id: 1,
        name: "Admin"
    },
    {
        id: 2,
        name: "Free User"
    }
];

export const minio = {
    expiryTime: 24 * 60 * 60 * 7
};

export const redis = {
    defaultAvatar: "default_avatar.jpeg",
    expireTime: 60 * 60 * 24 * 7,
    ansKey: "ANS",
    currentLesson: "current_lesson"
};

export const freeUser = {
    redisExpireTime: 60 * 60 * 24
};

export const selectUserField = ["id", "username", "firstName", "lastName"];

/**
 * Constant for file/upload
 */
export const file = {
    // File extension is support
    fileExtensionSupport: ["jpeg", "png", "jpg"],
    limitSizeUpload: 2 * 1000 * 1000
};

/**
 * Product Type
 */
export const typeProduct = [
    { type: 0, name: 'exchange' },
    { type: 1, name: 'sell' },
    { type: 2, name: 'exchange & sell' },
]

export const defaultBucket = "spiderapp";
