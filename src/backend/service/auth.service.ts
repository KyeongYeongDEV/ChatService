import { Inject, Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import {UserJoinRequestDTO, UserLoginRequestDTO} from "../dto/request/user"
import { UserJoinResponseDTO, UserLoginResponseDTO } from "../dto/response/user";
import JwtService from "./jwt.service";
import { CryptoService } from "./crypto.service";

@Service()
export default class AuthService {
    constructor(
        @Inject( () => UserRepository ) private readonly userRepository : UserRepository,
        @Inject( () => JwtService ) private readonly jwtService : JwtService,
        @Inject( () => CryptoService ) private readonly cryptoService :CryptoService,
        ) {}

    login = async ({ u_email, u_password } : UserLoginRequestDTO) : Promise<UserLoginResponseDTO> => {
        const user = await this.userRepository.findOndByPk({ u_email });

        if (!user) {
            throw new Error('존재하지 않는 아이디입니다');
        }

        console.log(user.password);
    
        if (!(await this.cryptoService.comparePassword(u_password, user.password))) {
            throw new Error('비밀번호가 일치하지 않습니다.')
        }

        const {password, ...payload} = user;
        const [ accessToken, refreshToken ] = await this.generateToken(payload);

        const userLoginResponseDTO : UserLoginResponseDTO = {
            statusCode : 200,
            message : '로그인에 성공했습니다',
            data : {accessToken, refreshToken},
        };

        return userLoginResponseDTO;
    }

    join = async (user : UserJoinRequestDTO) : Promise<UserJoinResponseDTO> =>{
        const existUser = await this.userRepository.findOndByPk({u_email : user.email});

        if (existUser) {
            throw new Error('이미 존재하는 이메일입니다');
        }

        const hashedPassword : string = await this.cryptoService.hashPassword(user.password);
        user.password = hashedPassword;

        await this.userRepository.create(user);

        const createUser = await this.userRepository.findOndByPk({u_email : user.email});
        const userJoinResponseDTO : UserJoinResponseDTO = {
            statusCode : 200,
            message : '가입에 성공하였습니다',
            data : createUser,
        }

        return userJoinResponseDTO;
    }

    private generateToken = async (payload : object) : Promise<[string, string]> => {
        return [this.jwtService.generateAccessToken(payload), this.jwtService.generateRefreshToken(payload)];
    }

}