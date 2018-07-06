"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate");
const uniqueValidator = require("mongoose-unique-validator");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Boom = require("boom");
const root_schema_1 = require("./root.schema");
const config_1 = require("../configs/config");
const constants_1 = require("../constants");
const Schema = mongoose.Schema;
class UserSchema {
    constructor() {
        this.schemaInstance = () => {
            const self = this;
            let schema = new Schema(this.schemaDef, Object.assign({}, root_schema_1.options, { collection: self.schemaName }));
            schema
                .plugin(paginate)
                .plugin(uniqueValidator);
            schema.methods.validatePassword = function (reqPassword) {
                if (!reqPassword) {
                    return null;
                }
                if (!this._doc.password)
                    return true;
                return Bcrypt.compareSync(reqPassword, this._doc.password);
            };
            schema.methods.removePrivacyInfo = (user) => {
                user._doc = _.omit(user._doc, ['password', 'resetPasswordToken', 'apikey', 'apisecret']);
                return user;
            };
            schema.methods.generationToken = (user) => {
                return jwt.sign(user, config_1.default.jwt.secretKey);
            };
            schema.pre('save', function (next) {
                if (this.isModified('password'))
                    this.password = self.hashPassword(this.password);
                next();
            });
            schema.post('save', function (error, doc, next) {
                if (error.name === 'ValidationError') {
                    if (error.errors.role)
                        next(Boom.badData('Role was outside scope'));
                    if (error.errors.password)
                        next(Boom.badData(error.errors.password.message));
                    if (error.errors.username) {
                        const { kind } = error.errors.username;
                        switch (kind) {
                            case 'unique':
                                next(Boom.conflict('Username is exist'));
                                break;
                            case 'user defined':
                                next(Boom.badData(error.errors.username.message));
                                break;
                            default:
                                next();
                                break;
                        }
                    }
                    next();
                }
                else {
                    next(error);
                }
            });
            schema.pre('find', function (next) {
                next();
            });
            schema.post('find', function (error, doc, next) {
                if (error.kind === 'ObjectId')
                    next(new Error('User is not found'));
                next();
            });
            schema.pre('findOneAndUpdate', function (next) {
                if (this.getUpdate().password)
                    this.getUpdate().password = self.hashPassword(this.getUpdate().password);
                if (this.getUpdate().apikey)
                    this.getUpdate().isUpdateKey = false;
                return next();
            });
            schema.post('findOneAndUpdate', (error, doc, next) => {
                if (error.code === 11000) {
                    return next(Boom.conflict('Username is exist'));
                }
                next();
            });
            return schema;
        };
        this.hashPassword = (password) => {
            if (!password)
                return null;
            return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
        };
        this.getName = () => {
            return this.schemaName;
        };
        this.validateUsername = () => {
            return [{
                    validator: function (v) {
                        return root_schema_1.validateMinLength(v, constants_1.Const.user.minLenUsername);
                    },
                    message: constants_1.Error.EM0106
                }, {
                    validator: function (v) {
                        return root_schema_1.validateMaxLength(v, constants_1.Const.user.maxLenUsername);
                    },
                    message: constants_1.Error.EM0105
                }];
        };
        this.validateEmail = () => {
            return [{
                    validator: function (email) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(email);
                    },
                    message: constants_1.Error.EM0110
                }];
        };
        this.validatePassword = () => {
            return [{
                    validator: function (v) {
                        return root_schema_1.validateMinLength(v, constants_1.Const.user.minLenPassword);
                    },
                    message: constants_1.Error.EM0107
                },
                {
                    validator: function (v) {
                        return root_schema_1.validateMaxLength(v, constants_1.Const.user.maxLenPassword);
                    },
                    message: constants_1.Error.EM0108
                },
                {
                    validator: function (v) {
                        return new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})").test(v);
                    },
                    message: constants_1.Error.EM0109
                }];
        };
        this.schemaName = 'User';
        this.schemaDef = {
            username: {
                type: String,
                required: [true, 'Username is required'],
                unique: true,
                dropDups: true,
                validate: this.validateUsername()
            },
            password: {
                type: String,
                required: [true, 'Password is required'],
                dropDups: true,
                trim: true,
                validate: this.validatePassword(),
            },
            role: {
                type: String,
                required: false,
                enum: ['1', '2', '3', '4'],
                trim: true,
                default: '4'
            },
            telegramChatId: {
                type: String,
                default: ''
            },
            telegramChatId2: {
                type: String,
                default: ''
            },
            isRemove: {
                type: Boolean,
                default: false
            }
        };
    }
}
exports.default = new UserSchema();
//# sourceMappingURL=user.schema.js.map