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
const services_1 = require("../services");
const root_handler_1 = require("./root.handler");
const libs_1 = require("../libs");
class AdminHandler extends root_handler_1.RootHandler {
    constructor(service = services_1.AdminService, router = express()) {
        super(service);
        this.className = 'AdminHandler';
        this.init = () => {
            let router = express_1.Router();
            router.get('/authen', this.HandlerResponse(this.authen));
            router.post('/user', this.HandlerResponse(this.create));
            router.get('/user/info', this.HandlerResponse(this.get));
            router.delete('/user', this.HandlerResponse(this.deleteUser));
            router.put('/user', this.HandlerResponse(this.update));
            router.get('/user/all', this.HandlerResponse(this.getAll));
            router.get('/user/countAll', this.HandlerResponse(this.countAll));
            this.router = router;
        };
        this.update = (req) => {
            const fnName = 'update';
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            return this.rootService.updateUser({
                data: req.body,
                query: req.query
            });
        };
        this.get = (req) => __awaiter(this, void 0, void 0, function* () {
            const fnName = 'get';
            let result;
            const { id } = req.query;
            libs_1.LogManager.logInfo(this.className, fnName, 'Function is calling');
            result = yield this.rootService.findUser({ _id: id, sessionID: req.sessionID, decode: req.decode });
            return result;
        });
        this.deleteUser = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            return yield this.rootService.deleteUser({ id });
        });
        this.authen = (req) => {
            return;
        };
        this.router = express_1.Router();
        this.init();
    }
}
exports.default = new AdminHandler();
//# sourceMappingURL=admin.handler.js.map