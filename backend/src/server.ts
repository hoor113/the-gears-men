import { App } from "./app";
import { AuthController } from "#controllers/authentication.controller";
import { UserController } from "#controllers/user.controller";

const controllers = [
    AuthController, 
    UserController
];

const app = new App(controllers);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
