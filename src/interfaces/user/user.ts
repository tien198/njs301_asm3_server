export default interface IUser {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    avatarUrl?: string
    role?: 'admin' | 'user'
}
