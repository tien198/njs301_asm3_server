import type { Types } from "mongoose";

export default interface Message {
    sender: Types.ObjectId; // userId 
    senderName: string
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}
