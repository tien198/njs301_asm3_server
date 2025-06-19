import type { IUser } from "../interfaces/user/user.js";

export default class UserDTO implements Partial<IUser> {
    email: string;
    name: string;
    phone: string;
    avatarUrl: string;
    role: 'admin' | 'user';

    constructor(user: IUser) {
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.avatarUrl = user.avatarUrl;
        this.role = user.role;
    }
}