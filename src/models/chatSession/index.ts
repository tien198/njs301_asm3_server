import type IChatSession from "../../interfaces/chatSession/chatSession.ts";
import type IUser from "../../interfaces/user/user.ts";
import type Message from "../../interfaces/chatSession/message.ts";
import type { IChatSessionMethod, IChatSessionModel } from "../../interfaces/chatSession/index.ts";

import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import MessageModel from "./message.js";

const ChatSessionSchema = new Schema<IChatSession, IChatSessionModel, IChatSessionMethod>({
    isActive: { type: Boolean, required: true },
    name: { type: String },
    participants: [{ type: Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, required: true },
    startedAt: { type: String, required: true },
    endedAt: { type: String }
}, {
    methods: {
        fetchMessages: async function (page: number, pageSize: number): Promise<Message[]> {
            return await MessageModel.find({ session: this._id })
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .exec();
        },
        sendMessage: async function (sender: HydratedDocument<IUser>, content: string): Promise<HydratedDocument<Message>> {

            const newMessage = new MessageModel({
                session: this._id,
                sender: sender._id,
                content,
                createdAt: new Date().toISOString()
            });
            return await newMessage.save()
        }
    }
});

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);

export default ChatSession