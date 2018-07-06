"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate");
const uniqueValidator = require("mongoose-unique-validator");
const root_schema_1 = require("./root.schema");
const Schema = mongoose.Schema;
class LogSchema {
    constructor() {
        this.schemaInstance = () => {
            const self = this;
            let schema = new Schema(this.schemaDef, Object.assign({}, root_schema_1.options, { collection: self.schemaName }));
            schema
                .plugin(paginate)
                .plugin(uniqueValidator);
            schema.post('save', (err, doc, next) => {
                next();
            });
            schema.post('findOneAndUpdate', (err, doc, next) => {
                next();
            });
            return schema;
        };
        this.getName = () => {
            return this.schemaName;
        };
        this.schemaName = 'Log';
        this.schemaDef = {
            type: {
                type: String,
                trim: true,
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: false
            },
            description: {
                type: String,
                required: false
            },
            isAuto: {
                type: Boolean,
            },
            name: {
                type: String,
            },
            isRemove: {
                type: Boolean,
                default: false
            },
            status: {
                type: Number,
                required: true
            }
        };
    }
}
exports.default = new LogSchema();
//# sourceMappingURL=log.schema.js.map