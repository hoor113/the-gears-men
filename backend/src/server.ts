import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { FileController } from './controllers/file.controller';

import { App } from './app';

const controllers = [AuthController, UserController, FileController];

const app = new App(controllers);

app.listen(5000);
