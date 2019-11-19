import express from "express";
import inventory from "../controllers/inventory";
import inventoryinitialstock from "../controllers/inventoryinitialstock";
import inventoryGlobal from "../controllers/inventoryGlobal";
import inventoryrequisitionEntry from "../controllers/inventoryrequisitionEntry";
import inventorytransferEntry from "../controllers/inventorytransferEntry";
import inventoryconsumption from "../controllers/inventoryconsumption";
import posEntry from "../controllers/posEntry";
import inventorystockAdjustment from "../controllers/inventorystockAdjustment";

const router = express();
router.use("/inventory", inventory());
router.use("/inventoryinitialstock", inventoryinitialstock());
router.use("/inventoryGlobal", inventoryGlobal());
router.use("/inventoryrequisitionEntry", inventoryrequisitionEntry());
router.use("/inventorytransferEntry", inventorytransferEntry());
router.use("/inventoryconsumption", inventoryconsumption());
router.use("/posEntry", posEntry());
router.use("/inventorystockAdjustment", inventorystockAdjustment());

export default router;
