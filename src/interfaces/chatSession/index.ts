import type { HydratedDocument, Model } from "mongoose";
import type { IChatSession } from "./chatSession.ts";
import type { IMessage } from "./message.ts";
import type { IUser } from "../user/user.ts";


export type { IChatSession, IMessage }

export interface IChatSessionMethod {
    fetchMessages(page: number, pageSize: number): Promise<IMessage[]>;
    sendMessage(sender: HydratedDocument<IUser>, content: string): Promise<IMessage>;
}

export interface IChatSessionModel extends Model<IChatSession> { }