export interface CreateChatRoomRequestDTO {
    title : string;
    u_id : number;
};

export interface GetCahtRoomRequestDTO {
    cr_id : number;
};

export interface CreateMessageRequestDTO {
    cr_id : number;
    u_id : number;
    m_content : string;
};

export interface GetMessageRequestDTO {
    m_id : number;
}