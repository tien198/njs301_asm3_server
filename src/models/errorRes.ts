import type { IRes } from "../interfaces/response/response.ts";

export default class ErrorRes<T extends object = object> implements IRes {
    statusText: string = "Internal Server Error";
    status: number;
    data?: T = undefined;

    constructor(statusText: string, status?: number, data?: T) {
        this.statusText = statusText;
        this.status = status || 500;
        this.data = data;
    }
}