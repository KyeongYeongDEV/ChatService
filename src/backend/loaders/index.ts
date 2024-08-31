import { Application } from "express";
import expressLoader from './express.loader';
import mysqlLoader from './mysql.loader';
import dependencyInjectionLoader from './depedency-injection.loader';
import http from 'http';

export default async ({ app, server }: { app: Application, server: http.Server }) => {
    const pool = await mysqlLoader();
    console.log('promise mysql2 loaded successfully 😊');

    await dependencyInjectionLoader(pool);
    console.log('DI loaded successfully 😊');

    await expressLoader({ app, server });
    console.log('express loaded successfully 😊');
};