import { Application, json, urlencoded } from "express";
import router from '../api/index.api';
import errorMiddleware from "../api/middlewares/error.middleware";
import cors from "cors";


export default async ({ app } : { app : Application }) => {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended : false }));
    app.use('/api', router());
    
    app.get('/', (req, res )=>{
        res.send("<h1>Main page</h1>")
    });
    
    app.use(errorMiddleware);
}