import { Inject, Service } from "typedi";
import { AccessJwtConfig, RefreshJwtConfig } from "../configs/jwt.config";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

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

    public decodedToken(token : string) : [number, string] | null {
        try {
            const decodedToken = jwt.decode(token);
            console.log(decodedToken);

            if (decodedToken && typeof decodedToken === 'object') {
                const u_id = decodedToken.u_id;
                const sender_name = decodedToken.name;
                return [u_id, sender_name];
            } else {
                throw new Error('유효하지 않은 토큰입니다.');
            }
        } catch (error) {
            console.error("토큰 디코딩 중 오류 발생: ", error);
            return null; 
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