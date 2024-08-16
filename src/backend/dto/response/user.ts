export interface UserDTO {
    u_id : number;
    email : string;
    password : string;
    name : string;
}

export interface UserLoginDTO {
    refreshToken : string;
    accessToken : string;
}