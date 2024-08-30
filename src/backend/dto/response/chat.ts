import { CommonResponseDTO } from ".";

export interface ChatRoomDTO {
    cr_id : number,
    u_id : number,
    title : string,
}

export interface MessageDTO {
    m_id : number,
    cr_id : number,
    u_id : number,
    content : string,
    sender_name : string,
    createAt : Date,
}

export interface ChatRoomWithUsersDTO {
    cr_id : number;
    title : string;
    users : number[];
}

export interface ChatRoomWithoutUidDTO {
    cr_id  : number;
    title : string;
}

export interface GetChatRoomWithUserResponseDTO {
    message : string;
    statusCode : number;
    data : ChatRoomWithoutUidDTO;
}

export interface GetMessageResponseDTO extends CommonResponseDTO<MessageDTO[]> {}
export interface GetCahtRoomResponseDTO extends CommonResponseDTO<ChatRoomDTO[]> {}
export interface GenerateChatRoomResponseDTO extends CommonResponseDTO<ChatRoomDTO> {}
export interface DeleteChatRoomResponseDTO extends CommonResponseDTO<null> {}
export interface GenerateChatRoomStatusDTO extends CommonResponseDTO<null> {}