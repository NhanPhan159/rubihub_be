import 'dotenv/config';

import express, { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './routes';
import { errorHandler } from './middlewares';
import configs from './configs';
import { logger } from './utils';
import { connectToDb } from './data';

const packageJson = require('../package.json');

(async () => {
  const app: Express = express();
  const port = process.env.PORT || 3000;

  if (configs.SWAGGER_ENABLED) {
    try {
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
      });

      app.use(
        configs.SWAGGER_API_SPEC,
        swaggerUI.serve,
        swaggerUI.setup(swaggerSpec),
      );
    } catch (error) {
      logger.error('Generate swagger api docs has failed: ', error);
    }
  }

  app.use(cors());
  app.use(bodyParser.json());
  app.use(router);
  app.use(errorHandler);

  app.listen(port, async () => {
    await connectToDb();
    console.info(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
