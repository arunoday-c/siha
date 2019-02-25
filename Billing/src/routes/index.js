import express from "express";
import billing from "../controllers/billing";
import opBilling from "../controllers/opBilling";
import opBillCancellation from "../controllers/opBillCancellation";
import opCreditSettlement from "../controllers/opCreditSettlement";

const router = express();
router.use("/billing", billing());
router.use("/opBilling", opBilling());
router.use("/opBillCancellation", opBillCancellation());
router.use("/opCreditSettlement", opCreditSettlement());

export default router;
