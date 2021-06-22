import { Router } from "express";

import admins from "./admins";
import auth from "./auth"
import users from "./users"
import groups from "./group"
const router = Router();

router.use("/api/admins", admins);
router.use("/api/groups", groups)
router.use("/api/auth", auth);
router.use("/api/users", users)

export default router;
