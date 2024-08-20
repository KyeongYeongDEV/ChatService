import Router from "express";
import auth from "./routes/auth.route";

export default () => {
    const router= Router();
    
    auth({ app : router });

    return router;
}