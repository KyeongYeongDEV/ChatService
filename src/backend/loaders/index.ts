import { Application } from "express";
import expressLoader from './express.loader';
import mysqlLoader from './mysql.loader';
import dependencyInjectionLoader from './depedency-injection.loader';

export default async ({ app } : { app : Application }) => {
    const pool = await mysqlLoader();
    console.log('promise mysql2 loaded successfully 😊');

    await dependencyInjectionLoader(pool);
    console.log('DI loaded successfully 😊');

    await expressLoader({ app });
    console.log('express loaded successfully 😊');
};