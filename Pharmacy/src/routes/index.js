import express from "express";
import initialstock from "../controllers/initialstock";
import pharmacy from "../controllers/pharmacy";
import posEntry from "../controllers/posEntry";
import pharmacyGlobal from "../controllers/pharmacyGlobal";
import salesReturn from "../controllers/salesReturn";

const router = express();
router.use("/initialstock", initialstock());
router.use("/pharmacy", pharmacy());
router.use("/posEntry", posEntry());
router.use("/pharmacyGlobal", pharmacyGlobal());
router.use("/salesReturn", salesReturn());

export default router;
