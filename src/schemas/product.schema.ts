import * as mongoose from "mongoose";
import * as paginate from "mongoose-paginate";
import * as uniqueValidator from "mongoose-unique-validator";
// import * as Bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
// import * as _ from "lodash";
import * as Boom from "boom";
// const phone = require("phone");
//
import { options, ISchema } from "./root.schema";
// import config from "../configs/config";
import { Error as errCode } from "../constants";
const Schema = mongoose.Schema;
// Interface
export interface IProductSchema extends ISchema {}
//
class ProductSchema implements IProductSchema {
    private schemaDef: mongoose.SchemaDefinition;
    private schemaName: string;

    /**
     * constructor
     */
    constructor() {
        this.schemaName = "Product";
        /**
         * config SchemaDef
         */

        this.schemaDef = {
            category: {
                type: Schema.Types.ObjectId,
                ref: "Category",
            },
            description: {
                type: String,
                trim: true
            },
            type: {
                type: Number,
                default: 0
            },
            price: {
                type: String,
                required: [true, errCode.EM0202],
                trim: true,
            },
            // link minio
            images: [{
                type: Schema.Types.ObjectId,
                ref: "File"
            }],
            address: {
                type: String,
                trim: true
            },
            name: {
                type: String,
                trim: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: Boolean,
                default: false
            },
            isRemove: {
                type: Boolean,
                default: false
            }
        };
    }

    /**
     * Create Schema Product
     */
    schemaInstance = () => {
        const self = this;
        const schema = new Schema(this.schemaDef, { ...options, collection: self.schemaName });

        schema
            .plugin(paginate)
            .plugin(uniqueValidator);

        schema.post("save", (err: any, {}, next) => {
            if (err && err.errors.images) {
                next(Boom.badData(errCode.EM0203));
            }

            next();
        });

        return schema;
    };


    /**
     * Get Name Model
     */

    getName = () => {
        return this.schemaName;
    };

}
export default new ProductSchema();
