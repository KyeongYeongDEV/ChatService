export interface UserJoinRequestDTO {
    email : string;
    password : string;
    name : string;
}

export interface UserLoginRequestDTO {
    u_email : string;
    u_password : string;
}