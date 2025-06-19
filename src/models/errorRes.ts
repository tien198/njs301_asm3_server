import type { IRes } from "../interfaces/response/response.ts";

export default class ErrorRes<T extends object = object> extends Error implements IRes {
    status: number = 500;
    cause?: T = undefined;

    constructor(message: string, status: number, cause?: T) {
        super(message);
        this.status = status;
        this.cause = cause;
    }
}