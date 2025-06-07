import { Schema, model } from 'mongoose';
import type Message from '../../interfaces/chatSession/message.ts';

const messageSchema = new Schema<Message>({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    senderName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
});

const MessageModel = model<Message>('Message', messageSchema);

export default MessageModel;
