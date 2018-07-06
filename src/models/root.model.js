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
const mongoose = require("mongoose");
const _ = require("lodash");
const Boom = require("boom");
const fs = require("fs");
const json2xls = require("json2xls");
const constants_1 = require("../constants");
const libs_1 = require("../libs");
const ObjectId = mongoose.Types.ObjectId;
class RootModel {
    constructor(schema) {
        this.create = (params) => {
            const fnName = 'create';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return new Promise((resolve, reject) => {
                const model = new this.model(params);
                model.save((err, result) => {
                    if (err && err.isBoom)
                        resolve(err);
                    else {
                        if (err)
                            resolve(Boom.conflict(err));
                        else
                            resolve(result);
                    }
                });
            });
        };
        this.update = (params) => __awaiter(this, void 0, void 0, function* () {
            let { query, data } = params;
            const fnName = 'update';
            let result;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            query._id = query.id;
            query = _.omit(query, ['id']);
            return new Promise((resolve, reject) => {
                this.model
                    .findOneAndUpdate(Object.assign({}, query, { isRemove: _.isUndefined(query.isRemove) ? false : query.isRemove }), data, (err) => {
                    if (err && err.isBoom)
                        return resolve(err);
                    if (err)
                        resolve(this.handlerQueryError(err));
                    resolve(this.findOne(query, []));
                });
            });
        });
        this.findById = (id) => {
            const fnName = 'findById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            let _id = new ObjectId(id);
            return new Promise((resolve, reject) => {
                this.model.findById(_id, (err, result) => {
                    if (err)
                        resolve(Boom.notFound('Have Error with database'));
                    else
                        resolve(result ? result : {});
                });
            });
        };
        this.deleteById = ({ id }) => {
            const fnName = 'deleteById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return new Promise((resolve, reject) => {
                this.model
                    .findOneAndUpdate({
                    _id: id
                }, {
                    isRemove: true
                }, (err) => {
                    resolve(err);
                });
            });
        };
        this.findOne = (filter, populate) => {
            const fnName = 'findOne';
            let _populate = this.populate;
            filter = _.omit(filter, ['decode', 'sessionID']);
            if (filter.id && !filter._id) {
                filter._id = filter.id;
                filter = _.omit(filter, ['id']);
            }
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return new Promise((resolve, reject) => {
                if (_.isUndefined(populate)) {
                    this.model
                        .find(Object.assign({}, filter, { isRemove: _.isUndefined(filter.isRemove) ? false : filter.isRemove }))
                        .limit(1)
                        .exec((err, result) => {
                        if (err)
                            resolve(this.handlerQueryError(err));
                        else
                            resolve(result);
                    });
                }
                else {
                    this.model
                        .find(Object.assign({}, filter, { isRemove: _.isUndefined(filter.isRemove) ? false : filter.isRemove }))
                        .populate(_.union(_populate, populate))
                        .limit(1)
                        .exec((err, result) => {
                        if (err)
                            resolve(this.handlerQueryError(err));
                        else
                            resolve(result);
                    });
                }
            });
        };
        this.model = mongoose.model(schema.getName(), schema.schemaInstance());
    }
    findAll(params, populate) {
        let { page, limit, query } = params;
        let skip = 0;
        const fnName = 'findAll';
        page = page || 1;
        limit = !_.isUndefined(limit) ? limit : constants_1.Const.LIMIT_RECORD;
        skip = params.skip | constants_1.Const.LIMIT_RECORD * (page - 1);
        if (query.name)
            query.name = new RegExp(query.name, 'i');
        if (query.username)
            query.username = new RegExp(query.username, 'i');
        if (query.desc)
            query.desc = new RegExp(query.desc, 'i');
        if (query.title)
            query.title = new RegExp(query.title, 'i');
        if (query.subject)
            query.subject = new RegExp(query.subject, 'i');
        return new Promise((resolve, reject) => {
            if (_.isUndefined(populate)) {
                this.model
                    .find(Object.assign({}, query, { isRemove: _.isUndefined(query.isRemove) ? false : query.isRemove }))
                    .limit(limit)
                    .skip(skip)
                    .sort({
                    $natural: -1
                })
                    .exec((err, result) => {
                    if (err)
                        resolve(this.handlerQueryError(err));
                    else
                        resolve(result);
                });
            }
            else {
                this.model
                    .find(Object.assign({}, query, { isRemove: _.isUndefined(query.isRemove) ? false : query.isRemove }))
                    .limit(limit)
                    .skip(skip)
                    .sort({
                    $natural: -1
                })
                    .populate(populate)
                    .exec((err, result) => {
                    if (err)
                        resolve(this.handlerQueryError(err));
                    else
                        resolve(result);
                });
            }
        });
    }
    getAll({ populate }) {
        const fnName = 'getAll';
        libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
        return new Promise((resolve, reject) => {
            if (populate) {
                this.model
                    .find({ isRemove: false })
                    .sort({
                    $natural: -1
                })
                    .populate(populate)
                    .exec((err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        resolve(this.handlerQueryError(err));
                    else
                        resolve(result);
                }));
            }
            else {
                this.model
                    .find({ isRemove: false })
                    .sort({
                    $natural: -1
                })
                    .exec((err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        resolve(this.handlerQueryError(err));
                    else
                        resolve(result);
                }));
            }
        });
    }
    exportFileXlsx(fields, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = '';
            let data = yield this.getAll({});
            const fnName = 'exportFileXlsx';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            if (data == null || data == 'undefined') {
                message = 'Database empty';
            }
            var xls = json2xls(data, {
                fields: fields
            });
            try {
                fs.writeFileSync(name, xls, 'binary');
                message = "The file was saved!";
            }
            catch (error) {
                message = error;
            }
            const result = {
                path: name.substring(name.indexOf('files'), name.length),
                message: message
            };
            return result;
        });
    }
    countAll({ query }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fnName = 'countAll';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            if (query) {
                return new Promise((resolve, reject) => {
                    this.model
                        .count(Object.assign({}, query, { isRemove: false }))
                        .exec((err, count) => {
                        if (err)
                            resolve(this.handlerQueryError(err));
                        else
                            resolve(count);
                    });
                });
            }
            else {
                return new Promise((resolve, reject) => {
                    this.model
                        .count({
                        isRemove: false
                    })
                        .exec((err, count) => {
                        if (err)
                            resolve(this.handlerQueryError(err));
                        else
                            resolve(count);
                    });
                });
            }
        });
    }
    ;
    delete(query) {
        if (query.id) {
            query._id = query.id;
            delete query.id;
        }
        return new Promise(resolve => {
            this.model.find(query).remove(err => {
                console.log(err);
                resolve();
            });
        });
    }
    handlerQueryError(err) {
        return Boom.badData(err);
    }
}
exports.RootModel = RootModel;
//# sourceMappingURL=root.model.js.map