import { Router } from "express";
import AdminsController from "../controllers/AdminsController";
import { emptySchema, createNewAdminSchema } from "./validations";

const admins = Router();

admins.get("/get_admins", emptySchema, AdminsController.getAll);
admins.post("/create_admin", createNewAdminSchema,  AdminsController.createAdmin);
admins.put("/admin/:uuid",  AdminsController.updateAdmin);

export default admins;