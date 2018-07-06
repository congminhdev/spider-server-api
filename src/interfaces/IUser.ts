import { IRoot } from "./IRoot";
//
enum Role {
    Admin = "1",
    FreeUser = "2"
}

interface IUser extends IRoot {
    username: string;
    password: string;
    email: string;
    fullName: string;
    address: string;
    phone: string;
    avatar: string;
    rating: number;
    star: number;
    googleToken?: string;
    facebookToken?: string;
    role: Role;
}

export { IUser };
