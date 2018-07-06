import { IRoot } from "./IRoot";
import { ICategory } from "./ICategory";
import { IUser } from "./IUser";
import { IFile } from "./IFile";
//
interface IProduct extends IRoot {
    category: ICategory;
    description: string;
    price: string;
    type: number;
    images: IFile[];
    address: string;
    name: string;
    user: IUser;
    status: boolean;
}

export { IProduct };
