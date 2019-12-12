import express from "express";
import DeliveryNoteEntry from "../controllers/DeliveryNoteEntry";
import PurchaseOrderEntry from "../controllers/PurchaseOrderEntry";
import ReceiptEntry from "../controllers/ReceiptEntry";
import PurchaseReturnEntry from "../controllers/PurchaseReturnEntry";
import RequestForQuotation from "../controllers/RequestForQuotation";

const router = express();
router.use("/DeliveryNoteEntry", DeliveryNoteEntry());
router.use("/PurchaseOrderEntry", PurchaseOrderEntry());
router.use("/ReceiptEntry", ReceiptEntry());
router.use("/PurchaseReturnEntry", PurchaseReturnEntry());
router.use("/RequestForQuotation", RequestForQuotation());

export default router;
