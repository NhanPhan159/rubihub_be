import 'dotenv/config';

import express, { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import { errorHandler } from './middlewares';

const packageJson = require('../package.json');

(async () => {
    const app: Express = express();
    const port = process.env.PORT || 3000;
    const swaggerSpec = swaggerJsdoc({
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Chatbot API',
                version: packageJson.version,
                description: 'APIs for English Chatbot',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        apis: [
            `${__dirname}/routes/**/*.ts`,
            `${__dirname}/contracts/**/*.ts`,
            `${__dirname}/services/**/*.ts`,
        ],
    }) as any;

    app.use(cors());
    app.use(bodyParser.json());
    app.use(router);
    app.use(errorHandler);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.listen(port, () => {
        console.info(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
})();
