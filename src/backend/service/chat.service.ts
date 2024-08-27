import { Inject, Service } from "typedi";
import { DeleteChatRoomResponseDTO, GenerateChatRoomResponseDTO, GenerateChatRoomStatusDTO, GetCahtRoomResponseDTO, GetMessageResponseDTO } from "../dto/response/chat";
import ChatRepository from "../repositories/chat.repository";
import MessageRepository from "../repositories/message.repository";

@Service()
export default class ChatService {
    constructor (
        @Inject( () => ChatRepository ) private readonly chatRepository : ChatRepository,
        @Inject( () => MessageRepository ) private readonly messageRepository : MessageRepository
    ){}

    async getMessage({ cr_id, u_id } : { cr_id : number, u_id :number }) : Promise<GetMessageResponseDTO> {
        const foundChatRoom  = await this.chatRepository.findOneByRoomId({ cr_id });

        if(!foundChatRoom) throw new Error('채팅방이 존재하지 않습니다');
        if(!(foundChatRoom.u_id !== u_id)) throw new Error('접근 권한이 없습니다.');

        const foundMessage = await this.messageRepository.findAllByRoomId({cr_id});
        return {
            message : '성공적으로 조회하였습니다',
            statusCode : 200,
            data : foundMessage
        };
    }

    async getChatRoom( { u_id } : {u_id : number}) : Promise<GetCahtRoomResponseDTO> {
        const foundChatRooms = await this.chatRepository.findAllByUid({u_id});

        return {
            message : '성공적으로 조회하였습니다',
            statusCode : 200,
            data : foundChatRooms,
        }
    }

    async generateChatRoom({ u_id, title } : { u_id : number, title : string }) : Promise<GenerateChatRoomResponseDTO> {
        const insertId = await this.chatRepository.create({ u_id , title });
        const newChatRoom = await this.chatRepository.findOneByRoomId({ cr_id : insertId });

        if(!newChatRoom) {
            throw new Error('채팅방 생성에 실패했습니다');
        }

        return {
            message : '정상적으로 채팅방이 생성 되었습니다',
            statusCode : 200,
            data : newChatRoom
        };
    }

    async deleteChatRoom({ cr_id } : { cr_id : number }) : Promise<DeleteChatRoomResponseDTO> {
        await this.chatRepository.delete({ cr_id });
        return {
            message : '삭제가 완료되었습니다.',
            statusCode : 200,
        }
    }

    async genereateChatRoomStatus( cr_id : number, chatRoomStatus : any ) : Promise<GenerateChatRoomStatusDTO> {
        await this.chatRepository.generateChatRoomStatusByRoomId( cr_id, chatRoomStatus);

        return { 
            message : '채팅방 상태가 생성되었습니다',
            statusCode : 200,
        }
    }

}