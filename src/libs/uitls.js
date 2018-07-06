"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const phone = require("phone");
const async = require("async");
const path = require("path");
const services_1 = require("../services");
const const_1 = require("../constants/const");
class Utils {
    constructor() {
        this.createAdminInit = () => __awaiter(this, void 0, void 0, function* () {
            const users = [{
                    username: 'admin',
                    password: 'Abc@123456',
                    role: "1"
                }];
            return new Promise(resolve => {
                async.eachSeries(users, (user, cb) => __awaiter(this, void 0, void 0, function* () {
                    let result = yield services_1.AdminService.create(user);
                    cb();
                }), () => {
                    resolve();
                });
            });
        });
        this.madeTelegramMessage = (topic) => {
            let message = "Author " + topic.author + " has new topic: " + topic.subject + " [link](" + topic.detail + ").";
            return message;
        };
    }
    isEmpty(param) {
        return _.isUndefined(param) || _.isEmpty(param) || _.isEmpty(param.trim());
    }
    removePrivacy(params) {
        return _.omit(params, ['password']);
    }
    getErrCode(param) {
        switch (param) {
            case 'username':
                return 'EM0002';
            case 'password':
                return 'EM0003';
            case 'files':
                return 'EM0009';
            case 'type':
                return 'EM0008';
        }
    }
    hashPassword(params, callback) {
        const saltRound = 10;
        const { password } = params;
        bcrypt.hash(password, saltRound, (err, hash) => {
            callback(null, hash);
        });
    }
    hashPasswordSync(password) {
        if (!password)
            return null;
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    }
    comparePassword(params, callback) {
        const { password, hash } = params;
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err)
                return callback(err);
            callback(null, isMatch);
        });
    }
    generationID() {
        return uuid.v4();
    }
    validatePhone(params) {
        return _.size(phone(params.phone, 'VN')) !== 0;
    }
    tmpDirectory() {
        return path.join(path.resolve(), "../../tmp/");
    }
    createFileName(fileName) {
        let arr = [];
        const timeStamp = new Date().getTime();
        arr = _.split(fileName, '.');
        return _.toString(`${_.dropRight(arr).join("")}-${timeStamp}.${arr[arr.length - 1]}`);
    }
    makeRedisKeyForAns({ lesson, sessionID }) {
        return `${lesson}-${sessionID}-${const_1.redis.ansKey}`;
    }
}
exports.default = new Utils();
//# sourceMappingURL=uitls.js.map