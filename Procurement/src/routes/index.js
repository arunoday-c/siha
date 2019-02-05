import express from "express";
import procurement from "../controllers/procurement";

const router = express();
router.use("/procurement", procurement());

export default router;
