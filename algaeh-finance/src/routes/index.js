import express from "express";

import finance from "../controllers/finance";
import voucher from "../controllers/voucher";

const router = express();
router.use("/finance", finance());
router.use("/voucher", voucher());

export default router;
