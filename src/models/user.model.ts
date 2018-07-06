import * as mongoose from 'mongoose';
//
import { RootModel, IRootModel } from "../models";
//
import { UserSchema as Schema } from '../schemas';
import { IUserSchema } from '../schemas';
// Interface
export interface IUserModel extends IRootModel {
    
}
//
class UserModel extends RootModel<IUserSchema> implements IUserModel {
    protected className = 'UserModel'
    protected model: mongoose.Model<mongoose.Document>;

    constructor(schema: IUserSchema = Schema) {
        super(schema);
    }
}

export default new UserModel();