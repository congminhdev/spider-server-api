
import * as mongoose from 'mongoose';
import * as paginate from "mongoose-paginate";
import * as uniqueValidator from "mongoose-unique-validator";
//
import { options, ISchema } from './root.schema';
const Schema = mongoose.Schema;
// Interface
export interface ILogSchema extends ISchema {

}
//
class LogSchema implements ILogSchema {
    private schemaDef: mongoose.SchemaDefinition;
    private schemaName: string;

    /**
     * constructor
     */
    constructor() {

        this.schemaName = 'Log';
        /**
         * config SchemaDef
         */

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

    /**
     * Create Schema User
     */
    schemaInstance = () => {
        const self = this;
        let schema = new Schema(this.schemaDef, { ...options, collection: self.schemaName });

        schema
            .plugin(paginate)
            .plugin(uniqueValidator);

        return schema;
    }

    /**
     * Get Name Model
     */
    getName = () => {
        return this.schemaName;
    }
}
export default new LogSchema();