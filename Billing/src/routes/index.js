import express from "express";
import billing from "../controllers/billing";
import opBilling from "../controllers/opBilling";

const router = express();
router.use("/billing", billing());
router.use("/opBilling", opBilling());

export default router;
