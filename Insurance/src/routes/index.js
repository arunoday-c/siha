import express from "express";
import insurance from "../controllers/insurance";

const router = express();
router.use("/insurance", insurance());

export default router;
