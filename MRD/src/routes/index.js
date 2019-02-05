import express from "express";
import mrd from "../controllers/mrd";

const router = express();
router.use("/mrd", mrd());

export default router;
