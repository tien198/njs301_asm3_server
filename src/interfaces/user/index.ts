import type { Model } from "mongoose";
import type IUser from "./user.ts";



export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    fullName(): string;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> { }
