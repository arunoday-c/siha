import express from "express";
import generalLedger from "../controllers/general_ledger";
import leave_approval from "../controllers/leave_approval";
import attendance from "../controllers/attandance";
import employee from "../controllers/employee";
import employee_payments from "../controllers/employee_payments";

const router = express();
router.use("/attendance", attendance());
router.use("/employee", employee());
router.use("/leave", leave_approval());
router.use("/testapi", generalLedger());
router.use("/employeepayments", employee_payments());
export default router;
