/**
 * Created by mrcongminh on 6/4/18.
 */
// import { find } from "lodash";
//
// import * as mongosse from 'mongoose';
import { RootModel, IRootModel } from "./root.model";
//
import { FileSchema as Schema, IFileSchema as ISchema } from '../schemas';
import { Const } from '../constants';
//
// Interface
export interface IFileModel extends IRootModel {

}
//
class FileModel extends RootModel<ISchema> implements IFileModel {
    populate = [
        {
            path: 'user',
            match: {
                isRemove: false
            },
            select: Const.selectUserField
        }
    ]

    constructor(schema: ISchema = Schema) {
        super(schema);
    }

}

export default new FileModel();