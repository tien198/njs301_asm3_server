import type { Model } from "mongoose";
import type IUser from "./user.ts";



export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    addToCart(productId: string, quantity: number): Promise<void>;
}

export interface IUserModel extends Model<IUser> { }
