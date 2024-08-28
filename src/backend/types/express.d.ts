import { Request } from "express";

export interface Payload {
    u_id : number,
    u_email : string,
    u_name : string,
}
declare global {
    namespace Express {
        interface Request {
            user?:Payload;
        }
    }
}