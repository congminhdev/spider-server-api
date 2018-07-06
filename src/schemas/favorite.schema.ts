import * as mongoose from "mongoose";
import * as paginate from "mongoose-paginate";
import * as uniqueValidator from "mongoose-unique-validator";
import * as Boom from "boom";
//
import { options, ISchema } from "./root.schema";
import { Error as errCode } from "../constants";
const Schema = mongoose.Schema;
// Interface
export interface IFavoriteSchema extends ISchema {}
//
class FavoriteSchema implements IFavoriteSchema {
    private schemaDef: mongoose.SchemaDefinition;
    private schemaName: string;

    /**
     * constructor
     */
    constructor() {
        this.schemaName = "Favorite";
        /**
         * config SchemaDef
         */

        this.schemaDef = {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            isRemove: {
                type: Boolean,
                default: false
            }
        };
    }

    /**
     * Create Schema Favorite
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
export default new FavoriteSchema();
