export interface ChatRoomDTO {
    title : string,
}

export interface MessageDTO {
    cr_id : number,
    content : string,
    sender_name : string,
    createAt : Date,
}