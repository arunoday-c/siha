import express from "express";
import insurance from "../controllers/insurance";
import invoiceGeneration from "../controllers/invoiceGeneration";
import denialMaster from "../controllers/denialMaster";

const router = express();
router.use("/insurance", insurance());
router.use("/invoiceGeneration", invoiceGeneration());
router.use("/denialMaster", denialMaster());

export default router;
