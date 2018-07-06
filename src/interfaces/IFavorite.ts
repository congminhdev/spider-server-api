import { IRoot } from "./IRoot";
import { IUser } from "./IUser";
import { IProduct } from "./IProduct";
//
interface IFavorite extends IRoot {
    user: IUser;
    product: IProduct;
}

export { IFavorite };
