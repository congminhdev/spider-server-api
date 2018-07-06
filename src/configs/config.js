"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prod_config_1 = require("./prod.config");
exports.env = process.env.NODE_ENV || 'develop';
exports.host = process.env.HOST || 'localhost';
exports.password = process.env.DB_PASSWORD || '';
exports.name = process.env.DB_NAME || '';
exports.user = process.env.DB_USER || '';
const redis_host = process.env.REDIS_HOST || exports.host;
const dbDev = {
    user: exports.user,
    host: exports.host,
    password: exports.password,
    name: exports.name
};
const local = {
    "jwt": {
        "options": {
            "algorithm": "HS256",
            "expirseIn": "24h"
        },
        "secretKey": "123@123",
        timeout: 15000
    },
    database: {
        host: `mongodb://${dbDev.user}:${dbDev.password}@${dbDev.host}/${dbDev.name}`
    },
    redis: {
        options: {
            host: '103.89.84.55',
            port: 6379
        }
    },
    session: {
        secret: 'IELTSSecret',
        resave: false,
        saveUninitialized: true
    },
    clientSite: 'http://localhost:8080',
};
const config = () => {
    console.log(`App is running with env: ${exports.env}`);
    switch (exports.env) {
        case 'prod':
            return prod_config_1.default;
        default:
            return local;
    }
};
exports.default = config();
exports.mail_config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    emailTo: 'tien.tranhuu94@gmail.com',
    auth: {
        user: 'tien.tranhuu94@gmail.com',
        pass: 'abkvypuywjncnivf'
    }
};
//# sourceMappingURL=config.js.map