import { Inject, Service } from "typedi";
import { ChatRoomWithUsersDTO, DeleteChatRoomResponseDTO, GenerateChatRoomResponseDTO, GenerateChatRoomStatusDTO, GetCahtRoomResponseDTO, GetChatRoomWithUserResponseDTO, GetMessageResponseDTO, MessageDTO, SaveMessageResponseDTO } from "../dto/response/chat";
import ChatRepository from "../repositories/chat.repository";
import MessageRepository from "../repositories/message.repository";

@Service()
export default class ChatService {
    constructor (
        @Inject( () => ChatRepository ) private readonly chatRepository : ChatRepository,
        @Inject( () => MessageRepository ) private readonly messageRepository : MessageRepository
    ){}

    async getMessagesByChatRoomId({ cr_id } : { cr_id : number }) : Promise<GetMessageResponseDTO> {
        const messages : MessageDTO[] = await this.chatRepository.findMessagesByChatRoomId({ cr_id });

        if (!messages) {
            throw new Error('메세지가 존재하지 않습니다');
        }

        return {
            message : '성공적으로 메세지를 조회했습니다',
            statusCode : 200,
            data : messages
        }
    }

    async saveMessage({ cr_id, u_id, sender_name, content, io } : { cr_id : number, u_id : number, sender_name : string, content : string, io : any }) : Promise<SaveMessageResponseDTO> {
        const m_id : number = await this.chatRepository.saveMessage({ cr_id, u_id, sender_name, content });

        io.to(cr_id).emit('chat message', { cr_id, u_id, sender_name, content });
        return {
            message : '성공적으로 메세지를 전송했습니다',
            statusCode : 200,
            data : {m_id}
        }
    }

    async getChatRoom( { u_id } : {u_id : number}) : Promise<GetCahtRoomResponseDTO> {
        const foundChatRooms = await this.chatRepository.findAllByUid({u_id});

        return {
            message : '성공적으로 조회하였습니다',
            statusCode : 200,
            data : foundChatRooms,
        }
    }

    async getChatRoomWithUsers({ cr_id } : { cr_id : number}) : Promise <GetChatRoomWithUserResponseDTO> {
        const chatRoom: ChatRoomWithUsersDTO | null = await this.chatRepository.findOneWithUsersByRoomId({ cr_id });
        if (chatRoom === null) throw new Error('채팅방이 존재하지 않습니다');

        return {
            message: '성공적으로 조회하였습니다',
            statusCode: 200,
            data: chatRoom,
        };
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

    async generateOneToOneChatRoom({ u_id, other_u_id, title } : { u_id : number, other_u_id : number, title : string }) : Promise <GenerateChatRoomResponseDTO> {
        const insertId = await this.chatRepository.createOneToOneChatRoom({ u_id, other_u_id, title });
        const newChatRoom = await this.chatRepository.findOneByRoomId({ cr_id : insertId });

        if (!newChatRoom) {
            throw new Error('일대일 채팅방 생성에 실패했습니다');
        }

        return {
            message : '정상적으로 일대일 채팅이 생성되었습니다',
            statusCode : 200,
            data : newChatRoom,
        };
    }
    
    async addUserToChatRoom({ u_id, cr_id } : { u_id : number, cr_id :number }) : Promise <GenerateChatRoomResponseDTO> {
        await this.chatRepository.addUserToChatRoom({ u_id, cr_id });
        const updatedChatRoom = await this.chatRepository.findOneByRoomId({ cr_id });

        if (!updatedChatRoom) {
            throw new Error('사용자 추가 후 채팅방 조회에 실패했습니다');
        }

        return {
            message : "정상적으로 사용자가 채팅방에 추가되었습니다",
            statusCode : 200,
            data : updatedChatRoom,
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