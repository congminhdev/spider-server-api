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
const constants_1 = require("../constants");
const services_1 = require("../services");
const models_1 = require("../models");
const libs_1 = require("../libs");
class AdminService extends services_1.RootService {
    constructor(model = models_1.UserModel) {
        super(model);
        this.className = 'AdminService';
        this.subjects = 'User';
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            let result;
            const fnName = 'create';
            libs_1.LogManager.logDebug(this.className, fnName, `Call API register new user ${params.username} is calling`);
            result = yield this.rootModel.create(params);
            if (!result) {
                libs_1.LogManager.logWarn(this.className, fnName, `Register user ${params.username} is fail: ${constants_1.Error.EM0100}`);
                return Boom.badRequest(constants_1.Error.EM0100);
            }
            if (result.isBoom) {
                let user = yield this.findOne({
                    username: params.username,
                    isRemove: true
                }, []);
                if (user && !user.isBoom && user.isRemove) {
                    return {
                        isBanner: true,
                        user: _.omit(user.toJSON(), ["password"])
                    };
                }
                return result;
            }
            else {
                libs_1.LogManager.logDebug(this.className, fnName, `Register new  user ${params.username} was successful`);
                return _.omit(result.toJSON(), ["password"]);
            }
        });
        this.findUser = (query) => __awaiter(this, void 0, void 0, function* () {
            let user;
            const fnName = 'findOne';
            libs_1.LogManager.logDebug(this.className, fnName, `Find user ${query.id} is calling`);
            user = yield this.findOne(query, []);
            if (user.isBoom) {
                libs_1.LogManager.logWarn(this.className, fnName, `Find user ${query.id} is fail`);
                return user;
            }
            if (!user) {
                libs_1.LogManager.logWarn(this.className, fnName, `Find user ${query.id} is fail`);
                return Boom.notFound('User not found');
            }
            libs_1.LogManager.logDebug(this.className, fnName, `End find user ${user.id} `);
            return user.removePrivacyInfo(user);
        });
        this.deleteUser = ({ id }) => __awaiter(this, void 0, void 0, function* () {
            return yield this.delete({ id });
        });
        this.getAll = (params) => __awaiter(this, void 0, void 0, function* () {
            const page = params.page ? params.page : 1;
            const limit = !_.isUndefined(params.limit) ? params.limit : constants_1.Const.LIMIT_RECORD;
            const fnName = 'loadMore';
            let users;
            let query = _(params)
                .pickBy(_.identity)
                .omit(params, ['page', 'limit', 'sessionID', 'decode'])
                .value();
            query.isRemove = { $in: [true, false] };
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            users = yield this.rootModel.findAll({
                page,
                limit,
                query
            }, this.rootModel.populate);
            yield _.forEach(users, (user, index) => __awaiter(this, void 0, void 0, function* () {
                users[index] = user.removePrivacyInfo(user);
            }));
            let result = (yield this.rootModel.countAll({ query })) || 0;
            return {
                record: users,
                page: {
                    currentPage: _.parseInt(page),
                    total: _.floor(result / constants_1.Const.LIMIT_RECORD) + 1
                }
            };
        });
        this.updateUser = (params) => __awaiter(this, void 0, void 0, function* () {
            let { data, query } = params;
            const fnName = 'update';
            let result, user;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.update(params);
            if (result.isBoom)
                return result;
            if (!result) {
                libs_1.LogManager.logWarn(this.className, fnName, `User login fail`);
                return Boom.badData(constants_1.Error.EM0103);
            }
            if (result.isBoom)
                return result;
            return result.removePrivacyInfo(result);
        });
        this.getListUserHasTelegramId = () => __awaiter(this, void 0, void 0, function* () {
            let query = {
                telegramChatId: { $ne: '' }
            };
            return yield this.rootModel.findAll({
                limit: 0,
                query: {
                    telegramChatId: { $ne: '' },
                    isRemove: false,
                }
            });
        });
    }
}
exports.default = new AdminService();
//# sourceMappingURL=admin.service.js.map