import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { siginInSchema, destroySelfSchema } from "./validations";
import { verifyToken } from "../helpers/verifyToken";

const auth = Router();

auth.post("/signin", siginInSchema, AuthController.siginin);
auth.post("/destroyOwnSessions",verifyToken, destroySelfSchema, AuthController.destroySelf);

export default auth;
