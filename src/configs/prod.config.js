"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.NODE_ENV || 'prod';
const host = process.env.HOST || '';
const db_host = process.env.DB_HOST || host;
const db_name = process.env.DB_NAME || 'next-password';
const db_user = process.env.DB_USER || `nexadev`;
const db_password = process.env.DB_PASSWORD || 'Abc12345678910';
const redis_host = process.env.REDIS_HOST || host;
const redis_port = process.env.REDIS_PORT || '6379';
const config = {
    database: {
        host: `mongodb://${db_user}:${db_password}@${db_host}/${db_name}`,
    },
    jwt: {
        options: {
            algorithm: "HS256",
            expirseIn: "24h",
        },
        secretKey: "123@123",
        timeout: 15000,
    },
    redis: {
        options: {
            host: redis_host,
            port: redis_port,
        },
    },
    clientSite: "",
};
exports.default = config;
//# sourceMappingURL=prod.config.js.map