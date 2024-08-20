import { Request ,Response, NextFunction } from "express";
import { json } from "stream/consumers";
import { Inject, Service } from "typedi";
import { UserJoinRequestDTO, UserLoginRequestDTO } from "../../dto/request/user";
import { UserJoinResponseDTO, UserLoginResponseDTO } from "../../dto/response/user";
import AuthService from "../../service/auth.service";

@Service()
export default class AuthController {
    constructor(@Inject( () => AuthService ) private readonly authService : AuthService){}

    login = async (req : Request, res : Response, next : NextFunction ) => {
        try {
            const {email, password} = req.body as UserLoginRequestDTO;
            const userLoginResponseDTO : UserLoginResponseDTO = await this.authService.login({ email, password });
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