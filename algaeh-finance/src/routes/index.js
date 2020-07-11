import express from "express";

import finance from "../controllers/finance";
import voucher from "../controllers/voucher";
import financeReports from "../controllers/financeReports";
import finance_masters from "../controllers/finance_masters";
import finance_customer from "../controllers/finance_customer";
import finance_supplier from "../controllers/finance_supplier";
import quick_search from "../controllers/quick_search";
import cashFlowStatement from "../controllers/cashFlowStatement";
import pl_comparison from "../controllers/pl_comparison";
import balanceSheet_report from "../controllers/balanceSheet_report";
import balanceSheetComparison from "../controllers/balanceSheetComparison";

const router = express();
router.use("/finance", finance());
router.use("/voucher", voucher());
router.use("/finance_masters", finance_masters());
router.use("/financeReports", financeReports());
router.use("/finance_customer", finance_customer());
router.use("/finance_supplier", finance_supplier());
router.use("/quick_search", quick_search());
router.use("/cashFlowStatement", cashFlowStatement());
router.use("/pl_comparison", pl_comparison());
router.use("/balanceSheet_report", balanceSheet_report());
router.use("/balanceSheetComparison", balanceSheetComparison());

export default router;
