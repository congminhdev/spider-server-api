import * as mongoose from 'mongoose';
//
import { RootModel, IRootModel } from "../models";
//
import { FavoriteSchema as Schema } from '../schemas';
import { IFavoriteSchema } from '../schemas';
// Interface
export interface IFavoriteModel extends IRootModel {
    
}
//
class FavoriteModel extends RootModel<IFavoriteSchema> implements IFavoriteModel {
    protected className = 'FavoriteModel'
    protected model: mongoose.Model<mongoose.Document>;

    populate = [
        {
            path: 'user',
            match: {
                isRemove: false
            }
        }, {
            path: 'product',
            match: {
                isRemove: false
            },
            populate: [
                {
                    path: 'images',
                    match: {
                        isRemove: false
                    }
                }
            ]
        },
    ]

    constructor(schema: IFavoriteSchema = Schema) {
        super(schema);
    }
}

export default new FavoriteModel();