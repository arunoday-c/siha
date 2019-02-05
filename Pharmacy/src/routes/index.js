import express from "express";
import initialstock from "../controllers/initialstock";

const router = express();
router.use("/initialstock", initialstock());

export default router;
