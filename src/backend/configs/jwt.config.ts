import { Service } from "typedi";

@Service()
export  class AccessJwtConfig {
    public readonly secret : string;
    public readonly expireIn : string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'defualt_secret';
        this.expireIn = process.env.JWT_EXPIRE_IN || '1h';
    }
}

@Service()
export class RefreshJwtConfig {
    public readonly secret : string;
    public readonly expireIn : string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'defualt_secret';
        this.expireIn = process.env.JWT_EXPIRE_IN || '1h';
    }
}