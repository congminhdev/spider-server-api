// HOST
// const host = process.env.HOST || "35.194.202.118";
const host = process.env.HOST || 'localhost'//'192.168.56.100'
// Database config
const db_host = process.env.DB_HOST || host;
const db_name = process.env.DB_NAME || "spider-dev";
const db_user = process.env.DB_USER || `congminhdev`;
const db_password = process.env.DB_PASSWORD || "congminhdev";
// Redis config
const redis_host = process.env.REDIS_HOST || host;
const redis_port = process.env.REDIS_PORT || "6379";
// Minio config
const minio_host = process.env.MINIO_HOST || host;
const minio_port = process.env.MINIO_PORT || 12345;
const minio_access_key = process.env.MINIO_ACCESS_KEY || "TN0JNTJCLE4JKZOKQYC5";
const minio_secret_key = process.env.MINIO_SECRET_KEY || "9766ZHNFMQKlL/AkpCBdhaAd67KvT8dVJnjZ77NO";
//
const config = {
    database: {
        host: `mongodb://${db_user}:${db_password}@${db_host}/${db_name}`
    },
    jwt: {
        options: {
            algorithm: "HS256",
            expirseIn: "24h"
        },
        secretKey: "123@123",
        timeout: 15000
    },
    redis: {
        options: {
            host: redis_host,
            port: redis_port
        }
    },
    minio: {
        endPoint: minio_host,
        port: minio_port,
        // secure: true,
        accessKey: minio_access_key,
        secretKey: minio_secret_key,
    },
    clientSite: ""
};

export default config;
