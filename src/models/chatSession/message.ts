import type { IMessage } from '../../interfaces/chatSession/message.ts';
import { Schema, model } from 'mongoose';

const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }
});

const MessageModel = model<IMessage>('Message', messageSchema);

export default MessageModel;
