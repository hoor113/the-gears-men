import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { FileController } from './controllers/file.controller';

import { App } from './app';

const controllers = [AuthController, UserController, FileController];

const app = new App(controllers);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
