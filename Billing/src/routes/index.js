import express from "express";
import billing from "../controllers/billing";

const router = express();
router.use("/billing", billing());

export default router;
