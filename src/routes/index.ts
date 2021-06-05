import { Router } from "express";

import admins from "./admins";

const router = Router();

router.use("/api/admins", admins);

export default router;
