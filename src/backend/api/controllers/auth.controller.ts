import { Request ,Response, NextFunction } from "express";
import { Inject, Service } from "typedi";
import { UserJoinRequestDTO, UserLoginRequestDTO } from "../../dto/request/user";
import { UserJoinResponseDTO, UserLoginResponseDTO } from "../../dto/response/user";
import AuthService from "../../service/auth.service";

@Service()
export default class AuthController {
    constructor(@Inject( () => AuthService ) private readonly authService : AuthService){}

    login = async (req : Request, res : Response, next : NextFunction ) => {
        try {
            const {u_email, u_password} = req.body as UserLoginRequestDTO;
            const userLoginResponseDTO : UserLoginResponseDTO = await this.authService.login({ u_email, u_password });
            
            // 쿠키에 액세스 토큰과 리프레시 토큰을 저장합니다.
            res.cookie('accessToken', userLoginResponseDTO.data?.accessToken, {
                httpOnly: true,  // 클라이언트 측에서 쿠키를 조작할 수 없도록 설정
                secure: process.env.NODE_ENV === 'production',  // HTTPS에서만 쿠키를 전송
                maxAge: 1000 * 60 *  60 // 유효 기간은 60분
            });

            res.cookie('refreshToken', userLoginResponseDTO.data?.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  // HTTPS에서만 쿠키를 전송
                maxAge: 1000 * 60 *  60 // 유효 기간은 60분
            });

            return res.status(200).json(userLoginResponseDTO);
        } catch (error) {
            return next(error);
        }
    };

    join = async (req : Request, res : Response, next : NextFunction) => {
        try { 
            const newUser = req.body as UserJoinRequestDTO;
            const userJoinResponseDTO : UserJoinResponseDTO = await this.authService.join(newUser);
            return res.status(200).json(userJoinResponseDTO);
        } catch (error) {
            return next(error);
        }
    }
}