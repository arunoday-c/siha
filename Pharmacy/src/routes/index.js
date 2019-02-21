import express from "express";
import initialstock from "../controllers/initialstock";
import pharmacy from "../controllers/pharmacy";
import posEntry from "../controllers/posEntry";

const router = express();
router.use("/initialstock", initialstock());
router.use("/pharmacy", pharmacy());
router.use("/posEntry", posEntry());

export default router;
