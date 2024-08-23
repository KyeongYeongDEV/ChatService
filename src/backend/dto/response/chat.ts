import { CommonResponseDTO } from ".";

export interface ChatRoomDTO {
    title : string,
}

export interface MessageDTO {
    cr_id : number,
    content : string,
    sender_name : string,
    createAt : Date,
}

export interface GetMessageResponseDTO extends CommonResponseDTO<MessageDTO[]> {}
export interface GetCahtRoomResponseDTO extends CommonResponseDTO<ChatRoomDTO[]> {}
export interface GenerateChatRoomResponseDTO extends CommonResponseDTO<ChatRoomDTO> {}
export interface DeleteChatRoomResponseDTO extends CommonResponseDTO<null> {}
export interface GenerateChatRoomStatusDTO extends CommonResponseDTO<null> {}