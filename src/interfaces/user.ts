import type { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    id?: string;
    password?: string;
    name?: string;
    phone?: number | string;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    fullName(): string;
}

export interface IUserModel extends IUser, IUserMethods { }
