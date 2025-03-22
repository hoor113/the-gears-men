import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
// import { setupSwagger } from "./config/swagger";
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';

import connectDB from './config/database';

dotenv.config();

export class App {
    public app: express.Application;

    constructor(controllers: Function[]) {
        this.app = express();
        this.connectDatabase();
        this.setupMiddlewares();
        this.setupControllers(controllers);
        // setupSwagger(this.app);
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
            routePrefix: '/api', // Định nghĩa prefix API
            defaultErrorHandler: false, // Tắt error handler mặc định của routing-controllers
        });

        console.log('Registered controllers:', controllers);
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    }
}
