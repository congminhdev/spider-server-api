import * as mongoose from 'mongoose';
//
import { RootModel, IRootModel } from "../models";
//
import { ProductSchema as Schema } from '../schemas';
import { IProductSchema } from '../schemas';
// Interface
export interface IProductModel extends IRootModel {
    
}
//
class ProductModel extends RootModel<IProductSchema> implements IProductModel {
    protected className = 'ProductModel'
    protected model: mongoose.Model<mongoose.Document>;

    populate = [
        {
            path: 'images',
            match: {
                isRemove: false
            }
        }, {
            path: 'category',
            match: {
                isRemove: false
            }
        }
    ]

    constructor(schema: IProductSchema = Schema) {
        super(schema);
    }
}

export default new ProductModel();