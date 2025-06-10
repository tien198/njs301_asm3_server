import { Types } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
}

export default interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    phone: string;
    avatarUrl: string
    role: 'admin' | 'user'
    cart: ICartItem[]
}
