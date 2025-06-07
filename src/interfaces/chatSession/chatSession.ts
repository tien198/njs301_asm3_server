import type { Types } from "mongoose";

export default interface IChatSession {
    isActive: boolean;
    name?: string;
    participants: Types.ObjectId[];
    isGroup: boolean;
    startedAt: string;       // ISO timestamp
    endedAt?: string;        // optional, if session is still ongoing
}