import { Types } from "mongoose";

interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
}

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    phone: string;
    avatarUrl: string
    role: 'admin' | 'user'
    cart: ICartItem[]
}
