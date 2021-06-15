import { Router } from "express";
import AdminsController from "../controllers/AdminsController";
import { emptySchema, createNewAdminSchema } from "./validations";
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
  createNewAdminSchema,
  AdminsController.createAdmin
);
admins.put(
  "/admin/:uuid",
  verifyToken,
  hasRoles(["admin"]),
  AdminsController.updateAdmin
);

export default admins;
