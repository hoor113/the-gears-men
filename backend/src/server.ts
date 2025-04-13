import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { FileController } from './controllers/file.controller';

import { App } from './app';

<<<<<<< HEAD
const controllers = [
    AuthController,
    UserController /* Add more controllers here */,
];
=======
const controllers = [AuthController, UserController, FileController];
>>>>>>> e65dd44d474f28c07dc6c6d97dd41a4f565a984c

const app = new App(controllers);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
