import express from "express";
import generalLedger from "../controllers/general_ledger";
import attendance from "../controllers/attandance";
const router = express();
router.use("/attendance", attendance());
router.use("/testapi", generalLedger());
export default router;
