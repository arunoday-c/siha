import express from "express";
import inventory from "../controllers/inventory";
import inventoryinitialstock from "../controllers/inventoryinitialstock";
import inventoryGlobal from "../controllers/inventoryGlobal";

const router = express();
router.use("/inventory", inventory());
router.use("/inventoryinitialstock", inventoryinitialstock());
router.use("/inventoryGlobal", inventoryGlobal());

export default router;
