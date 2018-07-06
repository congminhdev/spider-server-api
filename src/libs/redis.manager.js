"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const libs_1 = require("../libs");
const constants_1 = require("../constants");
const config_1 = require("../configs/config");
const options = config_1.default.redis.options;
class RedisManager {
    constructor() {
        this.className = 'RedisManager';
        this.fnName = '';
        this.removeKey = (key) => {
            this.fnName = 'removeKey';
            return new Promise(resolve => {
                this.client.unref();
                this.client.del(key, (err) => {
                    resolve();
                });
            });
        };
        this.setObject = (key, obj) => {
            this.client.HMSET(key, obj);
        };
        this.getObject = (key) => {
            return new Promise(resolve => {
                this.client.hgetall(key, (err, obj) => {
                    resolve(obj);
                });
            });
        };
    }
    init() {
        let client = redis.createClient(options);
        libs_1.LogManager.logInfo(this.className, 'redis', 'Connect redis server');
        return new Promise(resolve => {
            client.on('connect', () => {
                libs_1.LogManager.logInfo(this.className, 'redis', 'Connect redis server is successful');
                client.flushdb();
                resolve();
            });
            client.on('error', err => {
                libs_1.LogManager.logError(this.className, 'redis', 'Connect redis server was failure ' + err);
                throw err;
            });
            this.client = client;
        });
    }
    setKey(key, value, expire = constants_1.Const.redis.expireTime) {
        this.fnName = "setKey";
        expire = expire !== null ? expire : constants_1.Const.redis.expireTime;
        this.client.set(key, value, 'EX', expire);
    }
    getRedisKey(key) {
        this.fnName = 'getRedisKey';
        return new Promise((resolve, reject) => {
            this.client.unref();
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
}
exports.default = new RedisManager();
//# sourceMappingURL=redis.manager.js.map