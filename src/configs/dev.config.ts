// HOST
const host = process.env.HOST || "192.168.56.100";//develop
// Database config
const db_host = process.env.DB_HOST || host;
const db_name = process.env.DB_NAME || "spider-dev";
const db_user = process.env.DB_USER || "congminhdev";
const db_password = process.env.DB_PASSWORD || "congminhdev";
// Redis config
const redis_host = process.env.REDIS_HOST || host;
const redis_port = process.env.REDIS_PORT || "6379";
// Minio config
const minio_host = process.env.MINIO_HOST || "192.168.56.100";
const minio_port = process.env.MINIO_PORT || 12345;
const minio_access_key = process.env.MINIO_ACCESS_KEY || "TN0JNTJCLE4JKZOKQYC5";
const minio_secret_key = process.env.MINIO_SECRET_KEY || "9766ZHNFMQKlL/AkpCBdhaAd67KvT8dVJnjZ77NO";

//
const dbDev = {
    user: db_user,
    host: db_host,
    password: db_password,
    name: db_name
};

const config = {
    database: {
        host: dbDev.user ? `mongodb://${dbDev.user}:${dbDev.password}@${dbDev.host}/${dbDev.name}` : `mongodb://${dbDev.host}/${dbDev.name}`
    },
    jwt: {
        options: {
            algorithm: "HS256",
            expirseIn: "24h"
        },
        secretKey: "123@123",
        timeout: 15000
    },
    minio: {
        endPoint: minio_host,
        //secure: false,
        port: minio_port,
        accessKey: minio_access_key,
        secretKey: minio_secret_key
    },
    redis: {
        options: {
            host: redis_host,
            port: redis_port
        }
    },
    session: {
        secret: "SPIDERSecret",
        resave: false,
        saveUninitialized: true
    },
    clientSite: "http://localhost:8080",
    emailAdmin: "jsteamdev@gmail.vn",
    mail_config: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "jsteamdev@gmail.com",
            pass: "Abc@123456"
        }
    }
};

export default config;
