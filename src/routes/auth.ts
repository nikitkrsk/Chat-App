import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { siginInSchema } from "./validations";

const auth = Router();

auth.post("/signin", siginInSchema, AuthController.siginin);

export default auth;
