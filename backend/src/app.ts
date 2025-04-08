import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'reflect-metadata';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typedi';
import { OrderCronService } from './services/cron/order-cron.service';

import connectDB from './config/database';
import { AuthMiddleware } from './middlewares/auth.middleware';

dotenv.config();

export class App {
    public app: express.Application;

    constructor(controllers: Function[]) {
        this.app = express();
        this.connectDatabase();
        this.setupMiddlewares();
        this.setupControllers(controllers);
        // this.initializeAuthentication();
        this.initializeSwagger(controllers);
        this.initializeServices();
    }

    private async connectDatabase() {
        await connectDB();
    }

    private setupMiddlewares() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupControllers(controllers: Function[]) {
        useExpressServer(this.app, {
            controllers,
            defaultErrorHandler: false, // Tắt error handler mặc định của routing-controllers
        });

        console.log('Registered controllers:', controllers);
    }

    private initializeSwagger(controllers: Function[]) {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        });

        const routingControllersOptions = {
            controllers: controllers,
        };

        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(
            storage,
            routingControllersOptions,
            {
                components: {
                    schemas: schemas,
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                },
                security: [{ bearerAuth: [] }],
                info: {
                    description: 'Generated with `routing-controllers-openapi`',
                    title: 'A sample API',
                    version: '1.0.0',
                },
            },
        );

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
    }

    private initializeServices() {
        // Initialize the OrderCronService singleton
        Container.get(OrderCronService);
        console.log('🕒 Cron service initialized successfully');
    }

    public initializeAuthentication() {
        this.app.use(AuthMiddleware as express.RequestHandler);
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    }
}