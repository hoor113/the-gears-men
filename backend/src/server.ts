import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { FileController } from './controllers/file.controller';

import { App } from './app';

const controllers = [AuthController, UserController, FileController];

const app = new App(controllers);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
app.listen(port);
