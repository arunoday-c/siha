import express from "express";

import finance from "../controllers/finance";

const router = express();
router.use("/finance", finance());

export default router;
