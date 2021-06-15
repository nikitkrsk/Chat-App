import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { siginInSchema, destroySchema, emptySchema } from "./validations";
import { verifyToken } from "../helpers/verifyToken";
import { hasRoles } from "../helpers/roleCheck";

const auth = Router();

auth.post("/signin", siginInSchema, AuthController.siginin);
auth.get("/mySessions",  verifyToken, emptySchema,  AuthController.selfSessions)
auth.post(
  "/destroyOwnSessions",
  verifyToken,
  destroySchema,
  AuthController.destroySelf
);
auth.post(
  "/adminDestroySessions",
  verifyToken,
  hasRoles(["admin"]),
  destroySchema,
  AuthController.adminDestroy
);

export default auth;
