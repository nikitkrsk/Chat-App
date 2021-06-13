import { Router } from "express";

import admins from "./admins";
import auth from "./auth"
const router = Router();

router.use("/api/admins", admins);
router.use("/api/auth", auth);

export default router;
