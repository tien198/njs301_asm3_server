import type { Model } from "mongoose";
import type IChatSession from "./chatSession.ts";
import type IChatSessionMethod from "./chatSessionMethod.ts";


export default interface IChatSessionModel extends Model<IChatSession, {}, IChatSessionMethod> { }