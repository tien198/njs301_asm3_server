import type { HydratedDocument, Model } from "mongoose";
import type IUser from "./user.ts";



export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    addToCart(productId: string, quantity: number): Promise<HydratedDocument<IUser>>;
}

export interface IUserModel extends Model<IUser> { }
