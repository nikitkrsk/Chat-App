import { Router } from "express";
import AdminsController from "../controllers/AdminsController";
import { emptySchema, createNewUserSchema, updateUserSchema } from "./validations";
import { verifyToken } from "../helpers/verifyToken";
import { hasRoles } from "../helpers/roleCheck";
const admins = Router();

admins.get(
  "/get_admins",
  verifyToken,
  hasRoles(["admin"]),
  emptySchema,
  AdminsController.getAll
);
admins.post(
  "/create_admin",
  verifyToken,
  hasRoles(["admin"]),
  createNewUserSchema,
  AdminsController.createAdmin
);
admins.put(
  "/admin/updateSelf",
  verifyToken,
  hasRoles(["admin"]),
  updateUserSchema,
  AdminsController.updateAdmin
);

export default admins;
