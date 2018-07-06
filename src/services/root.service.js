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
const Boom = require("boom");
const mongoose = require("mongoose");
const async = require("async");
const constants_1 = require("../constants");
const libs_1 = require("../libs");
class RootService {
    constructor(rootModel) {
        this.fnName = '';
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'create';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return yield this.rootModel.create(params);
        });
        this.findOne = (query, populate) => __awaiter(this, void 0, void 0, function* () {
            let result;
            const fnName = 'findOne';
            let _populate = _.union(populate, this.rootModel.populate);
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootModel.findOne(_.omit(query, ['decode', 'sessionID']), _populate);
            result = result[0];
            if (_.isUndefined(result))
                return this.subjectNotFound();
            return result;
        });
        this.delete = (query) => __awaiter(this, void 0, void 0, function* () {
            let result;
            const fnName = 'delete';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            if (query.id) {
                query.id = mongoose.Types.ObjectId(query.id);
            }
            result = yield this.rootModel.delete(query);
            if (!result) {
                return {
                    message: "Delete success"
                };
            }
            else
                return result;
        });
        this.update = (params) => __awaiter(this, void 0, void 0, function* () {
            let { data, query } = params;
            const fnName = 'update';
            let result;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            if (data.isRemove)
                query.isRemove = { $in: [true, false] };
            result = yield this.rootModel.findOne({
                _id: query.id,
                isRemove: data.isRemove ? { $in: [true, false] } : false
            });
            result = result[0];
            if (_.isUndefined(result))
                return this.subjectNotFound();
            result = yield this.rootModel.update({
                query,
                data
            });
            if (_.size(result) === 1)
                return result[0];
            return result;
        });
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'findById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return yield this.rootModel.findById(id);
        });
        this.count = (params) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'count';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
        });
        this.countAll = (params) => __awaiter(this, void 0, void 0, function* () {
            const { query } = params;
            const fnName = 'countAll';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return yield this.rootModel.countAll({ query });
        });
        this.getAll = (params) => __awaiter(this, void 0, void 0, function* () {
            const page = params.page ? params.page : 1;
            const limit = !_.isUndefined(params.limit) ? params.limit : constants_1.Const.LIMIT_RECORD;
            const skip = params.skip;
            let query = _(params)
                .pickBy(_.identity)
                .omit(params, ['page', 'limit', 'sessionID', 'decode', 'skip'])
                .value();
            const fnName = 'loadMore';
            let result, result1;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootModel.findAll({
                page,
                limit,
                query,
                skip
            }, this.rootModel.populate);
            if (result && result.isBoom) {
                return result;
            }
            result1 = yield this.rootModel.countAll({ query });
            if (result1.isBoom) {
                return result1;
            }
            else {
                return {
                    record: result,
                    page: {
                        currentPage: _.parseInt(page),
                        total: _.floor(result1 / constants_1.Const.LIMIT_RECORD) + 1
                    }
                };
            }
        });
        this.exportFileXlsx = (params) => __awaiter(this, void 0, void 0, function* () {
            const fields = params.fields;
            const name = params.name;
            const fnName = 'exportFileXlsx';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return yield this.rootModel.exportFileXlsx(fields, name);
        });
        this.updateById = (params) => {
            const fnName = 'updateById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            if (params && params.id) {
                params = _.pick(params, ['id', 'data']);
                this.rootModel.update(params);
            }
        };
        this.subjectNotFound = () => {
            return Boom.notFound(this.subjects + ' is not found');
        };
        this.checkFiles = (params) => {
            return new Promise(resolve => {
                if (_.isUndefined(params.files)) {
                    return resolve([]);
                }
                else if (_.isArray(params.files))
                    return resolve(params.files);
                else {
                    try {
                        params.files = JSON.parse(params.files);
                        if (!_.isArray(params.files)) {
                            libs_1.LogManager.logError(this.className, this.fnName, 'Files field was wrong format');
                            return resolve(this.badData('Images field was wrong format'));
                        }
                        else
                            return resolve(params.files);
                    }
                    catch (e) {
                        libs_1.LogManager.logError(this.className, this.fnName, 'Files field was wrong format');
                        return resolve(this.badData('Images field was wrong format'));
                    }
                }
            });
        };
        this.updateFileUrl = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                async.eachSeries(params, (question, cb) => {
                    const index = _.findIndex(params, question);
                    async.eachSeries(question.files, (file, cb1) => __awaiter(this, void 0, void 0, function* () {
                        const i = _.findIndex(question.files, file);
                        question.files[i]._doc.url = yield file.setUrl();
                        cb1();
                    }), () => {
                        cb();
                    });
                }, () => {
                    return resolve(params);
                });
            });
        });
        this.checkTip = (tip) => {
            return new Promise(resolve => {
                if (_.isUndefined(tip))
                    resolve({});
                try {
                    let _tip = JSON.parse(tip);
                    if (_.isObject(_tip))
                        resolve(_tip);
                    else
                        resolve(Boom.badData('Wrong format tip field'));
                }
                catch (e) {
                    resolve(Boom.badData('Wrong format tip field'));
                }
            });
        };
        this.checkMoreSpec = (moreSpec) => {
            return new Promise(resolve => {
                if (_.isUndefined(moreSpec))
                    resolve({});
                try {
                    let _moreSpec = JSON.parse(moreSpec);
                    if (_.isObject(_moreSpec))
                        resolve(_moreSpec);
                    else
                        resolve(Boom.badData('Wrong format more spec field'));
                }
                catch (e) {
                    resolve(Boom.badData('Wrong format more spec field'));
                }
            });
        };
        this.requiredParams = (params, object) => __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                async.eachSeries(object, (obj, cb) => {
                    if (_.isUndefined(params[obj.name]))
                        return resolve(Boom.badData(constants_1.Error[obj.code]));
                    else
                        cb();
                }, () => {
                    resolve();
                });
            });
        });
        this.rootModel = rootModel;
    }
    badData(message) {
        return Boom.badData(message);
    }
    checkImages(params, cb) {
        this.fnName = 'checkImages';
        if (!params.images)
            return;
        try {
            params.images = JSON.parse(params.images);
            if (!_.isArray(params.images)) {
                libs_1.LogManager.logError(this.className, this.fnName, 'Images field was wrong format');
                cb(this.badData('Images field was wrong format'));
            }
            cb(null, params.images);
        }
        catch (e) {
            libs_1.LogManager.logError(this.className, this.fnName, 'Images field was wrong format');
            cb(this.badData('Images field was wrong format'));
        }
    }
    checkFile(params, cb) {
        this.fnName = 'checkImages';
        if (!params.files)
            cb();
        try {
            params.files = JSON.parse(params.files);
            if (!_.isArray(params.files)) {
                libs_1.LogManager.logError(this.className, this.fnName, 'Files field was wrong format');
                cb(this.badData('Images field was wrong format'));
            }
            cb(null, params.files);
        }
        catch (e) {
            libs_1.LogManager.logError(this.className, this.fnName, 'Files field was wrong format');
            cb(this.badData('Images field was wrong format'));
        }
    }
    getFile(files) {
        return new Promise(resolve => {
            async.eachSeries(files, (file, cb) => __awaiter(this, void 0, void 0, function* () {
                const index = _.findIndex(files, file);
                cb();
            }), () => {
                resolve(files);
            });
        });
    }
    requiredId(id) {
        return new Promise(resolve => {
            if (!id) {
                return resolve(Boom.badData(`ID of ${this.subjects} is required`));
            }
            resolve();
        });
    }
}
exports.default = RootService;
//# sourceMappingURL=root.service.js.map