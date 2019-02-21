import express from "express";
import initialstock from "../controllers/initialstock";
import pharmacy from "../controllers/pharmacy";
import posEntry from "../controllers/posEntry";
import pharmacyGlobal from "../controllers/pharmacyGlobal";

const router = express();
router.use("/initialstock", initialstock());
router.use("/pharmacy", pharmacy());
router.use("/posEntry", posEntry());
router.use("/pharmacyGlobal", pharmacyGlobal());

export default router;
