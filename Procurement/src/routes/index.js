import express from "express";
import DeliveryNoteEntry from "../controllers/DeliveryNoteEntry";
import PurchaseOrderEntry from "../controllers/PurchaseOrderEntry";
import ReceiptEntry from "../controllers/ReceiptEntry";

const router = express();
router.use("/DeliveryNoteEntry", DeliveryNoteEntry());
router.use("/PurchaseOrderEntry", PurchaseOrderEntry());
router.use("/ReceiptEntry", ReceiptEntry());

export default router;
