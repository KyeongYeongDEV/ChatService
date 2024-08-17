import { CommonResponseDTO } from ".";

export interface UserDTO {
    u_id : number;
    u_email : string;
    u_password : string;
    u_name : string;
}

export interface UserLoginDTO {
    refreshToken : string;
    accessToken : string;
}

export interface UserLoginResponseDTO extends CommonResponseDTO<UserLoginDTO> {}
export interface UserJoinResponseDTO extends CommonResponseDTO<UserDTO>{}