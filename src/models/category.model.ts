import * as mongoose from 'mongoose';
//
import { RootModel, IRootModel } from "../models";
//
import { CategorySchema as Schema } from '../schemas';
import { ICategorySchema } from '../schemas';
// Interface
export interface ICategoryModel extends IRootModel {
    
}
//
class CategoryModel extends RootModel<ICategorySchema> implements ICategoryModel {
    protected className = 'CategoryModel'
    protected model: mongoose.Model<mongoose.Document>;

    populate = [
        {
            path: 'parent',
            match: {
                isRemove: false
            }
        }
    ]
    
    constructor(schema: ICategorySchema = Schema) {
        super(schema);
    }
}

export default new CategoryModel();