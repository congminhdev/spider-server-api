/**
 * Created by mrcongminh on 6/4/18.
 */
import * as mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate';
import * as uniqueValidator from 'mongoose-unique-validator';
//
const Schema = mongoose.Schema;
import { options, ISchema } from './root.schema';
import { MinioManager } from '../libs';
// Interface
export interface IFileSchema extends ISchema {

}
class FileSchema implements IFileSchema {

    private schemaDef: mongoose.SchemaDefinition;
    // private schemaOptions: mongoose.SchemaOptions;
    private schemaName: string;
    // private schema: mongoose.Schema;

    constructor() {
        this.schemaName = 'File';
        /**
         * Config SchemaDef
         */
        this.schemaDef = {
            name: {
                type: String,
                trim: true
            },
            url: {
                type: String,
                trim: true
            },
            isRemove: {
                type: Boolean,
                default: false
            },
        }
    }


    /**
     * Create Schema Product
     */
    schemaInstance = () => {
        const self = this;
        let schema = new Schema(this.schemaDef, { ...options, collection: self.schemaName });

        schema.methods.setUrl = async function () {
            return await MinioManager.getFileUrl({
                fileName: this.name
            })
        }

        schema
            .plugin(paginate)
            .plugin(uniqueValidator);

        return schema;
    }

    /**
     * Get Name model
     */
    getName = () => {
        return this.schemaName;
    }
}

export default new FileSchema();

