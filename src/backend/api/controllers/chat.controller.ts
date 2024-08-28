import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { DeleteChatRoomResponseDTO, GetCahtRoomResponseDTO, GetMessageResponseDTO } from "../../dto/response/chat";
import ChatService from "../../service/chat.service";
import { Payload } from "../../types/express";

@Service()
export default class ChatController {
    constructor(@Inject( () => ChatService) private readonly chatService : ChatService) {}

    getMessages = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const { u_id } : { u_id : number } = req.body as Payload;
            const cr_id : number = parseInt(req.params.cr_id);
            const messageResponseDTO : GetMessageResponseDTO = await this.chatService.getMessages({ cr_id, u_id });
            console.log(messageResponseDTO);
            return res.status(200).json(messageResponseDTO);
        } catch (error) {
            return next(error);
        }
    };
    
    getChatRooms = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const { u_id } : { u_id : number } = req.user as Payload;
            const cahtRoomResponseDTO : GetCahtRoomResponseDTO = await this.chatService.getChatRoom({ u_id });
            return res.status(200).json(cahtRoomResponseDTO);
        } catch (error) {
            return next(error);
        }
    };

    generateChatRoom = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const { u_id } : { u_id : number } = req.body as Payload;
            const { title } : { title : string } = req.body;

            const cahtRoomResponseDTO = await this.chatService.generateChatRoom({ u_id, title });
            return res.status(200).json(cahtRoomResponseDTO);
        } catch (error) {
            return next(error);
        }
    };

    generateChatRoomStatus = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const cr_id : number = parseInt(req.params.cr_id);
            const chatRoomStatus = req.body;
            const genereateChatRoomResponseDTO = await this.chatService.genereateChatRoomStatus(cr_id, chatRoomStatus);
            return res.status(200).json(genereateChatRoomResponseDTO);
        } catch (error) {
            return next(error);
        }
    };

    deleteChatRoom = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const cr_id : number = parseInt(req.params.cr_id);
            const cahtRoomResponseDTO : DeleteChatRoomResponseDTO = await this.chatService.deleteChatRoom({cr_id});
            return res.status(200).json(cahtRoomResponseDTO);
        } catch (error) {
            return next(error);
        }
    };
}