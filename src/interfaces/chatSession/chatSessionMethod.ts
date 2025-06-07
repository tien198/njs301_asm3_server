import type { HydratedDocument } from "mongoose";
import type IUser from "../user/user.ts";
import type Message from "./message.ts";

export default interface IChatSessionMethod {
    fetchMessages(page: number, pageSize: number): Promise<Message[]>;
    sendMessage(sender: HydratedDocument<IUser>, content: string): Promise<Message>;
}