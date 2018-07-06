// import * as Boom from "boom";

//
import { RootService, IService } from "../services";
import { IFavoriteModel as IModel } from "../models";
import { FavoriteModel } from "../models";
//

export interface IFavoriteService extends IService {}
//
class FavoriteService extends RootService<IModel> implements IFavoriteService {
    protected className = "FavoriteService";
    protected subjects = "Favorite";
    fnName = "";

    constructor(model: IModel = FavoriteModel) {
        super(model);
    }
}

export default new FavoriteService();
