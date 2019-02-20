import express from "express";
import initialstock from "../controllers/initialstock";
import pharmacy from "../controllers/pharmacy";

const router = express();
router.use("/initialstock", initialstock());
router.use("/pharmacy", pharmacy());

export default router;
