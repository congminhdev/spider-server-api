import * as mongoose from "mongoose";
import * as paginate from "mongoose-paginate";
import * as uniqueValidator from "mongoose-unique-validator";
import * as Boom from "boom";
//
import { options, ISchema } from "./root.schema";
import { Error as errCode } from "../constants";
const Schema = mongoose.Schema;
// Interface
export interface ICategorySchema extends ISchema {}
//
class CategorySchema implements ICategorySchema {
    private schemaDef: mongoose.SchemaDefinition;
    private schemaName: string;

    /**
     * constructor
     */
    constructor() {
        this.schemaName = "Category";
        /**
         * config SchemaDef
         */

        this.schemaDef = {
            name: {
                type: String,
                trim: true,
                required: [true, errCode.EM0301],
                unique: true,
                dropDups: true,
            },
            parent: {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: false
            },
            isRemove: {
                type: Boolean,
                default: false
            }
        };
    }

    /**
     * Create Schema Category
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
export default new CategorySchema();
