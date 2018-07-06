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
const path_1 = require("path");
const _ = require("lodash");
const libs_1 = require("../libs");
const constants_1 = require("../constants");
class RootHandler {
    constructor(rootService) {
        this.create = (req) => {
            const fnName = 'create';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.create(Object.assign({}, req.body, { sessionID: req.sessionID, decode: req.decode }));
        };
        this.update = (req) => {
            const fnName = 'update';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.update({
                data: req.body,
                query: req.query
            });
        };
        this.get = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'get';
            let result;
            const { id } = req.query;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootService.findOne({ _id: id, sessionID: req.sessionID, decode: req.decode });
            return result;
        });
        this.delete = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'delete';
            const { id } = req.query;
            let result;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootService.delete({ id });
            return result;
        });
        this.getAll = (req) => {
            const fnName = 'getAll';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.getAll(Object.assign({}, req.query, { sessionID: req.sessionID, decode: req.decode }));
        };
        this.countAll = (req) => {
            const fnName = 'countAll';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            const { query } = req;
            return this.rootService.countAll({ query });
        };
        this.findById = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'findById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.findById(req.params.id);
        });
        this.exportFileXlsx = (req) => {
            const fnName = 'exportFileXlsx';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            const fields = ['name', 'sku'];
            const name = path_1.join(__dirname, '../files', 'export-file', 'product.xlsx');
            return this.rootService.exportFileXlsx({ fields, name });
        };
        this.updateById = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'updateById';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            let params = _.merge(req.params, req.body.data);
            return this.rootService.updateById(params);
        });
        this.HandlerResponse = (handlerController) => {
            const fnName = 'HandlerResponse';
            return (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (handlerController.length === 1) {
                    let result = yield handlerController(req);
                    if (result && result.isBoom) {
                        let err = result.output;
                        res.status(err.statusCode).send({
                            success: 0,
                            error: err.payload
                        });
                    }
                    else {
                        res.send({
                            success: 1,
                            result
                        });
                    }
                }
                else {
                    handlerController(req, res);
                }
            });
        };
        this.loginFailHandler = (id) => __awaiter(this, void 0, void 0, function* () {
            let key = `${id}-${constants_1.Const.LOGIN_FAIL}`;
            let keyDisable = `${id}-${constants_1.Const.DISABLE_USER}`;
            let totalLoginFail = (yield libs_1.RedisManger.getRedisKey(key)) || 0;
            if (totalLoginFail < constants_1.Const.LIMIT_NUMBER_LOGIN_FAIL) {
                libs_1.RedisManger.setKey(key, +totalLoginFail + 1, constants_1.Const.LOGIN_FAIL_EXPIRE_TIME);
            }
            else {
                libs_1.RedisManger.setKey(keyDisable, true, constants_1.Const.LOGIN_FAIL_EXPIRE_TIME);
            }
        });
        this.rootService = rootService;
    }
    ;
}
exports.RootHandler = RootHandler;
//# sourceMappingURL=root.handler.js.map