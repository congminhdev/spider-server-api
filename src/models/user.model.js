"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const schemas_1 = require("../schemas");
class UserModel extends models_1.RootModel {
    constructor(schema = schemas_1.UserSchema) {
        super(schema);
        this.className = 'UserModel';
    }
}
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map