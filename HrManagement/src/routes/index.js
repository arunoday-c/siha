import express from "express";
import generalLedger from "../controllers/general_ledger";
const router = express();
router.use("/testapi", generalLedger());
export default router;
