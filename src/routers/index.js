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
const express = require("express");
const _ = require("lodash");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
const user_handler_1 = require("./user.handler");
const admin_handler_1 = require("./admin.handler");
const libs_1 = require("../libs");
const constants_1 = require("../constants");
const config_1 = require("../configs/config");
class Routing {
    constructor(router = express()) {
        this.checkBannedClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { sessionID, decode } = req;
            let keyDisable = `${sessionID}-${constants_1.Const.DISABLE_USER}`;
            const isBanned = (yield libs_1.RedisManger.getRedisKey(keyDisable)) || false;
            if (isBanned) {
                res.status(423).send({
                    success: 0,
                    result: Boom.locked(constants_1.Error.EM0003).output
                });
            }
            else {
                next();
            }
        });
        this.router = express.Router();
    }
    init() {
        this.router.use(this.authenHandler);
        this.router.use('/user', user_handler_1.default.router);
        this.router.use('/admin', this.checkAdminPermission, admin_handler_1.default.router);
    }
    authenHandler(req, res, next) {
        const url = req.originalUrl;
        let token, authenString;
        if (_.indexOf(constants_1.Const.whiteListUrl, url) !== -1) {
            next();
        }
        else {
            authenString = _.split(req.headers.authorization, ' ');
            if (!_.isEmpty(authenString) && authenString[0] === 'x-access-token') {
                token = authenString[1];
                jwt.verify(token, config_1.default.jwt.secretKey, function (err, decode) {
                    if (err) {
                        res.status(403).send({
                            success: 0,
                            result: Boom.forbidden(constants_1.Error.EM0001).output.payload
                        });
                    }
                    else {
                        req.decode = decode;
                        next();
                    }
                });
            }
            else {
                res.status(403).send({
                    success: 0,
                    result: Boom.forbidden(constants_1.Error.EM0001).output
                });
            }
        }
    }
    decodeToken(req, res, next) {
        const url = req.originalUrl;
        let token, authenString;
        if (req.headers.authorization) {
            authenString = _.split(req.headers.authorization, ' ');
            if (!_.isEmpty(authenString) && authenString[0] === 'x-access-token') {
                token = authenString[1];
                jwt.verify(token, config_1.default.jwt.secretKey, function (err, decode) {
                    if (err) {
                        next();
                    }
                    else {
                        req.decode = decode;
                        next();
                    }
                });
            }
            else {
                res.status(403).send({
                    success: 0,
                    result: Boom.forbidden(constants_1.Error.EM0001).output
                });
            }
        }
        else {
            next();
        }
    }
    checkAdminPermission(req, res, next) {
        if (_.parseInt(req.decode.role) !== 1) {
            return res.send(Boom.forbidden(constants_1.Error.EM0001));
        }
        next();
    }
}
exports.default = new Routing();
//# sourceMappingURL=index.js.map