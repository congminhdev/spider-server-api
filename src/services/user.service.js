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
const Boom = require("boom");
const _ = require("lodash");
const services_1 = require("../services");
const models_1 = require("../models");
const constants_1 = require("../constants");
const libs_1 = require("../libs");
class UserService extends services_1.RootService {
    constructor(model = models_1.UserModel) {
        super(model);
        this.className = 'UserService';
        this.subjects = 'User';
        this.fnName = '';
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.rootModel.create(params);
            const fnName = 'create';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function create new user is calling');
            if (user._doc) {
                user = _.omit(user._doc, ['password']);
            }
            return user;
        });
        this.login = (params) => __awaiter(this, void 0, void 0, function* () {
            let user;
            let token;
            const fnName = 'login';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function login user is calling');
            if (_.isEmpty(params.password) || _.isEmpty(params.username)) {
                return this.badData('Username or password is wrong');
            }
            user = yield this.rootModel.findOne(_.omit(params, ['password']));
            user = user[0];
            if (!user) {
                libs_1.LogManager.logWarn(this.className, fnName, `User login fail`);
                return Boom.badData('Username or password is wrong');
            }
            if (user.isBoom)
                return user;
            if (!user.validatePassword(params.password)) {
                libs_1.LogManager.logWarn(this.className, fnName, `User  ${user.username} login fail wrong password`);
                return Boom.badData('Username or password is wrong');
            }
            user = user.removePrivacyInfo(user);
            token = user.generationToken(user.toJSON());
            libs_1.LogManager.logDebug(this.className, fnName, `User ${user.username} login success`);
            return Object.assign({}, user.toJSON(), { token });
        });
        this.findOne = (query) => __awaiter(this, void 0, void 0, function* () {
            let user;
            const fnName = 'findOne';
            libs_1.LogManager.logDebug(this.className, fnName, `Find user ${query.id} is calling`);
            user = yield this.rootModel.findOne(query);
            if (user && user.isBoom) {
                libs_1.LogManager.logWarn(this.className, fnName, `Find user ${query.id} is fail`);
                return user;
            }
            user = user[0];
            if (_.isUndefined(user)) {
                return this.subjectNotFound();
            }
            user = user.removePrivacyInfo(user);
            libs_1.LogManager.logDebug(this.className, fnName, `End find user ${query.id} `);
            return user;
        });
        this.update = (params) => __awaiter(this, void 0, void 0, function* () {
            let { data, query } = params;
            const fnName = 'update';
            let result, user;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootModel.findOne({
                _id: query.id
            });
            result = result[0];
            if (_.isUndefined(result))
                return this.subjectNotFound();
            data = _.omit(data, ['role', 'isRemove']);
            result = yield this.rootModel.update({
                query,
                data
            });
            if (result.isBoom) {
                libs_1.LogManager.logWarn(this.className, fnName, `Update user ${query.id} is fail`);
                return result;
            }
            user = result[0];
            user = user.removePrivacyInfo(user);
            return user;
        });
        this.register = (params) => __awaiter(this, void 0, void 0, function* () {
            let result;
            const fnName = 'register';
            libs_1.LogManager.logDebug(this.className, fnName, `Call API register new user ${params.username} is calling`);
            result = yield this.rootModel.create(params);
            if (!result) {
                libs_1.LogManager.logWarn(this.className, fnName, `Register user ${params.username} is fail: ${constants_1.Error.EM0100}`);
                return Boom.badRequest(constants_1.Error.EM0100);
            }
            if (result.isBoom)
                return result;
            else {
                libs_1.LogManager.logDebug(this.className, fnName, `Register new  user ${params.username} was successful`);
                return _.omit(result.toJSON(), ['password']);
            }
        });
        this.changePassword = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data, query } = params;
            const { oldPassword, password } = data;
            this.fnName = 'changePassword';
            let user, result;
            libs_1.LogManager.logInfo(this.className, this.fnName, 'Function change user password is calling');
            if (!oldPassword)
                return Boom.badData(constants_1.Error.EM0101);
            if (!password)
                return Boom.badData(constants_1.Error.EM0104);
            user = yield this.rootModel.findOne(_.omit(params.query, ['password', 'oldPassword']));
            user = user[0];
            if (!user) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Find user fail`);
                return Boom.badData(constants_1.Error.EM0103);
            }
            if (user.isBoom)
                return user;
            if (!user.validatePassword(oldPassword)) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `User  ${user.username} validate password fail`);
                return Boom.badData(constants_1.Error.EM0102);
            }
            result = yield this.rootModel.update({
                query,
                data: {
                    password
                }
            });
            if (result.isBoom) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Update user ${query.id} is fail`);
                return result;
            }
            user = result[0];
            user = user.removePrivacyInfo(user);
            return user;
        });
        this.forgotPassword = (params) => __awaiter(this, void 0, void 0, function* () {
            const { email } = params;
            this.fnName = 'forgotPassword';
            let user, result, token;
            libs_1.LogManager.logInfo(this.className, this.fnName, 'Function forgot password is calling');
            if (!email) {
                return Boom.badData(constants_1.Error.EM0112);
            }
            user = yield this.rootModel.findOne({ email });
            user = user[0];
            if (!user) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Find user fail`);
                return Boom.badData(constants_1.Error.EM0103);
            }
            token = user.generationToken(email + JSON.stringify(Date.now()));
            result = yield this.rootModel.update({
                query: {
                    id: user.id
                },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000,
                }
            });
            if (result.isBoom) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Update user ${user.id} is fail`);
                return '';
            }
            user = result[0];
            user = user.removePrivacyInfo(user);
            return user;
        });
        this.resetPassword = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data, query } = params;
            const { password } = data;
            this.fnName = 'resetPassword';
            let user, result;
            libs_1.LogManager.logInfo(this.className, this.fnName, 'Function reset password is calling');
            if (!password)
                return Boom.badData(constants_1.Error.EM0104);
            user = yield this.rootModel.findOne(params.query);
            user = user[0];
            if (!user) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Password reset token is invalid or has expired.`);
                return Boom.badData(constants_1.Error.EM0113);
            }
            result = yield this.rootModel.update({
                query: Object.assign({}, query, { id: user.id }),
                data: {
                    password,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined,
                }
            });
            if (result.isBoom) {
                libs_1.LogManager.logWarn(this.className, this.fnName, `Update user ${query.id} is fail`);
                return result;
            }
            user = result[0];
            return user;
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map