import { Inject, Service } from "typedi";
import { AccessJwtConfig, RefreshJwtConfig } from "../configs/jwt.config";
import jwt from "jsonwebtoken";

@Service()
export default class JwtService {
    constructor(
        @Inject( () => AccessJwtConfig ) private readonly accessJwtConfig : AccessJwtConfig,  
        @Inject( () => RefreshJwtConfig ) private readonly refreshJwtConfig : RefreshJwtConfig
    ){}

    generateAccessToken(payload : object) : string {
        return jwt.sign(payload, this.accessJwtConfig.secret, {expiresIn : this.accessJwtConfig.expireIn});
    }

    generateRefreshToken(payload : object) : string {
        return jwt.sign(payload, this.refreshJwtConfig.secret, {expiresIn : this.refreshJwtConfig.expireIn});
    }

    verifyAccessToken(token : string) : object | string {
        try{
            return jwt.verify(token, this.accessJwtConfig.secret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    verifyRefreshToken(token : string) : object | string {
        try {
            return jwt.verify(token, this.refreshJwtConfig.secret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
} 