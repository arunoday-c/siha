import express from "express";

import finance from "../controllers/finance";
import voucher from "../controllers/voucher";
import financeReports from "../controllers/financeReports";
import finance_masters from "../controllers/finance_masters";

const router = express();
router.use("/finance", finance());
router.use("/voucher", voucher());
router.use("/finance_masters", finance_masters());
router.use("/financeReports", financeReports());

export default router;
