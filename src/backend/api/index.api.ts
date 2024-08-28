import Router from "express";
import auth from "./routes/auth.route";
import chat from "./routes/chat.route";

export default () => {
    const router= Router();
    
    auth({ app : router });
    chat({ app : router });

    return router;
}