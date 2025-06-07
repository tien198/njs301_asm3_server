import type { Types } from "mongoose";

export default interface IMessage {
    sender: Types.ObjectId; // userId 
    senderName: string
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}
