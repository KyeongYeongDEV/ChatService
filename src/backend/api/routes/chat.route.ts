import { Router } from "express";
import Container from "typedi";
import ChatController from "../controllers/chat.controller";
import guardMiddleware from "../middlewares/guard.middleware";

export default ({ app } : { app : Router }) => {
    const route = Router();
    app.use("/chat", route);

    route.get('/', guardMiddleware, Container.get(ChatController).getChatRoomWithUsers.bind(ChatController));
    route.post('/', guardMiddleware, Container.get(ChatController).generateOneToOneChatRoom.bind(ChatController));
    route.post('/invite', guardMiddleware, Container.get(ChatController).addUserToChatRoom.bind(ChatController));

    route.post('/:cr_id/status', guardMiddleware, Container.get(ChatController).generateChatRoomStatus.bind(ChatController));
    route.delete('/:cr_id', guardMiddleware, Container.get(ChatController).deleteChatRoom.bind(ChatController));

    route.get('/:cr_id/messages', guardMiddleware, Container.get(ChatController).getMessages.bind(ChatController));
    route.post('/:cr_id/messages', guardMiddleware, Container.get(ChatController).sendMessage.bind(ChatController));
}