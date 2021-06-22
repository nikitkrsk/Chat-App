import { Router } from "express";
import GroupsController from "../controllers/GroupsController";
import { emptySchema } from "./validations";
import { verifyToken } from "../helpers/verifyToken";

const groups = Router();

groups.get("/get_all", verifyToken, emptySchema, GroupsController.getAll);


export default groups;
