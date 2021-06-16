import { Router } from "express";
import UsersController from "../controllers/UsersController";
import { createNewUserSchema, updateUserSchema } from "./validations";
import { verifyToken } from "../helpers/verifyToken";

const users = Router();

users.post("/create_user", createNewUserSchema, UsersController.createUser);
users.put(
  "/update_user",
  verifyToken,
  updateUserSchema,
  UsersController.updateUser
);

export default users;
