import express from "express";
import generalLedger from "../controllers/general_ledger";
import leave_approval from "../controllers/leave_approval";
import attendance from "../controllers/attandance";
const router = express();
router.use("/attendance", attendance());
router.use("/leave", leave_approval());
router.use("/testapi", generalLedger());
export default router;
