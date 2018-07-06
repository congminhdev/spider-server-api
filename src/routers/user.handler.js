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
const express_1 = require("express");
const express = require("express");
const _ = require("lodash");
const services_1 = require("../services");
const libs_1 = require("../libs");
const root_handler_1 = require("./root.handler");
class UserHandler extends root_handler_1.RootHandler {
    constructor(service = services_1.UserService, router = express()) {
        super(service);
        this.className = 'UserHandler';
        this.init = () => {
            let router = express_1.Router();
            router.get('/', this.HandlerResponse(this.get));
            router.get('/authen', this.HandlerResponse(this.authen));
            router.put('/', this.HandlerResponse(this.update));
            router.post('/register', this.HandlerResponse(this.register));
            router.post('/login', this.HandlerResponse(this.login));
            router.put('/password', this.HandlerResponse(this.changePassword));
            router.post('/forgot', this.HandlerResponse(this.forgotPassword));
            this.router = router;
        };
        this.register = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'register';
            libs_1.LogManager.logDebug(this.className, fnName, 'Register new user with ' + req.body.username + ' call API login');
            req.body.role = '4';
            return this.rootService.register(req.body);
        });
        this.login = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'login';
            let result;
            const { sessionID, decode } = req;
            libs_1.LogManager.logDebug(this.className, fnName, 'User ' + req.body.username + ' call API login');
            result = yield this.rootService.login(req.body);
            if (result.isBoom) {
                this.loginFailHandler(sessionID);
            }
            return result;
        });
        this.get = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'get';
            let result;
            const { id } = req.decode;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootService.findOne({ _id: id });
            return result;
        });
        this.update = (req) => {
            const fnName = 'update';
            if (_.isEmpty(req.body.password)) {
                req.body = _.omit(req.body, ['password']);
            }
            req.body = _.pickBy(req.body, _.identity);
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.update({
                data: _.omit(req.body, ['role', 'avatar']),
                query: {
                    id: req.decode.id
                }
            });
        };
        this.changePassword = (req) => {
            const fnName = 'update';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.changePassword({
                data: _.omit(req.body, ['role', 'avatar']),
                query: {
                    id: req.decode.id
                }
            });
        };
        this.forgotPassword = (req) => {
            const fnName = 'forgot';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.forgotPassword({
                email: req.body.email
            });
        };
        this.authen = (req) => {
            return;
        };
        this.router = express_1.Router();
        this.init();
    }
}
exports.default = new UserHandler();
//# sourceMappingURL=user.handler.js.map