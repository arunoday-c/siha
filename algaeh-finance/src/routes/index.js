import express from "express";

import finance from "../controllers/finance";
import voucher from "../controllers/voucher";
import financeReports from "../controllers/financeReports";
import finance_masters from "../controllers/finance_masters";
import finance_customer from "../controllers/finance_customer";
import finance_supplier from "../controllers/finance_supplier";

const router = express();
router.use("/finance", finance());
router.use("/voucher", voucher());
router.use("/finance_masters", finance_masters());
router.use("/financeReports", financeReports());
router.use("/finance_customer", finance_customer());
router.use("/finance_supplier", finance_supplier());

export default router;
