// import * as Boom from "boom";

//
import { RootService, IService } from "../services";
import { ICategoryModel as IModel } from "../models";
import { CategoryModel } from "../models";
//

export interface ICategoryService extends IService {}
//
class CategoryService extends RootService<IModel> implements ICategoryService {
    protected className = "CategoryService";
    protected subjects = "Category";
    fnName = "";

    constructor(model: IModel = CategoryModel) {
        super(model);
    }
}

export default new CategoryService();
