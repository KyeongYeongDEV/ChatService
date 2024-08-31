import 'reflect-metadata';
import express, { Application } from 'express';
import loaders from './loaders';
import http from 'http';

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output');

export default async function createApp(): Promise<{ app : Application, server : http.Server }> {
    const app: Application = express();
    const server = http.createServer(app);
    await loaders({ app, server });

    // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    return { app, server };
}