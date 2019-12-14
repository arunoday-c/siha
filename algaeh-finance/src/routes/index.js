import express from "express";

import finance from "../controllers/finance";
import voucher from "../controllers/voucher";
import financeReports from "../controllers/financeReports";

const router = express();
router.use("/finance", finance());
router.use("/voucher", voucher());
router.use("/financeReports", financeReports());

export default router;
