import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Inject, Service } from 'typedi';
import UserRepository from '../repositories/user.repository';
import { AccessJwtConfig } from './jwt.config';

@Service()
export default class PassportConfig {
    constructor(
        @Inject( () => AccessJwtConfig ) private readonly accessJwtConfig : AccessJwtConfig,
        @Inject( () => UserRepository ) private readonly userRepository : UserRepository 
    ){}

    public initialize() {
        const opts : StrategyOptions = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : this.accessJwtConfig.secret,
        };

        passport.use(
            new JwtStrategy(opts, async (jwt_payload, done) => {
                try {  
                    const user = await this.userRepository.findOndByPk(jwt_payload.u_id);
                    if (user) {
                        return done(null, user);
                    } else {
                        return  done(null, false);
                    }
                } catch (error) {   
                    return done(error, false);
                }
            })
        )
    }
}