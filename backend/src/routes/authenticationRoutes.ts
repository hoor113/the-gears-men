import express from "express";
import {
    register,
    login,
    logout
} from "#controllers/authentication/authenticationController"

const authenticationRouter = express.Router();

authenticationRouter.post("/register", register);
authenticationRouter.post("/login", login);
authenticationRouter.post("/logout", logout);

export default authenticationRouter;
