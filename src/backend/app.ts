import 'reflect-metadata';
import express, { Application } from 'express';
import loaders from './loaders';
// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output');

export default async function createApp(): Promise<Application> {
    const app: Application = express();
    await loaders({ app });

    // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    return app;
}