import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';

import { App } from './app';

const controllers = [
    AuthController,
    UserController /* Add more controllers here */,
];

const app = new App(controllers);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
