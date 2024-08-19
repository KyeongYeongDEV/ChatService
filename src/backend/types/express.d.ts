import { Request } from "express";

export interface payload {
    u_id : number,
    u_email : string,
    u_name : string,
}
declare global {
    namespace Exress {
        interface Request {
            user?:payload;
        }
    }
}