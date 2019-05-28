import express from "express";
import insurance from "../controllers/insurance";
import invoiceGeneration from "../controllers/invoiceGeneration";

const router = express();
router.use("/insurance", insurance());
router.use("/invoiceGeneration", invoiceGeneration());

export default router;
