import { Types } from "mongoose";

export default interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    phone: string;
    avatarUrl: string
    role: 'admin' | 'user'
    cart: {
        productRef: Types.ObjectId;
        quantity: number;
    }[]
}
