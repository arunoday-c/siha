import express from "express";
import initialstock from "../controllers/initialstock";
import pharmacy from "../controllers/pharmacy";
import posEntry from "../controllers/posEntry";
import pharmacyGlobal from "../controllers/pharmacyGlobal";
import salesReturn from "../controllers/salesReturn";
import requisitionEntry from "../controllers/requisitionEntry";
import transferEntry from "../controllers/transferEntry";
import POSCreditSettlement from "../controllers/POSCreditSettlement";
import consumptionEntry from "../controllers/consumptionEntry";
import stockAdjustment from "../controllers/stockAdjustment";

const router = express();
router.use("/initialstock", initialstock());
router.use("/pharmacy", pharmacy());
router.use("/posEntry", posEntry());
router.use("/pharmacyGlobal", pharmacyGlobal());
router.use("/salesReturn", salesReturn());
router.use("/requisitionEntry", requisitionEntry());
router.use("/transferEntry", transferEntry());
router.use("/POSCreditSettlement", POSCreditSettlement());
router.use("/consumptionEntry", consumptionEntry());
router.use("/stockAdjustment", stockAdjustment());

export default router;
