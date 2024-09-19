import { Application } from "express";
import http from 'http';
import expressLoader from './express.loader';
import dependencyInjectionLoader from './dependency-injection.loader';
import socketLoader from "./chatSocket.loader";
import mysqlLoader from "./mysql.loader";

export default async ({ app, server }: { app: Application, server: http.Server }) => {
    //const pool = await mysqlLoader();
    //console.log('promise mysql2 loaded successfully 😊');

    //await socketLoader({ app, server });
    //console.log('socket loaded successfully 😊');

    //await dependencyInjectionLoader({ pool });
    //console.log('DI loaded successfully 😊');
    
    // await expressLoader({ app });
    // console.log('express loaded successfully 😊');
};