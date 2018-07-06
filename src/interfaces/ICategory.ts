import { IRoot } from "./IRoot";
//
interface ICategory extends IRoot {
    name: string;
    parent: any
}

export { ICategory };
