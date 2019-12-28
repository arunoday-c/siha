import express from "express";
import DeliveryNoteEntry from "../controllers/DeliveryNoteEntry";
import PurchaseOrderEntry from "../controllers/PurchaseOrderEntry";
import ReceiptEntry from "../controllers/ReceiptEntry";
import PurchaseReturnEntry from "../controllers/PurchaseReturnEntry";
import RequestForQuotation from "../controllers/RequestForQuotation";
import VendorsQuotation from "../controllers/VendorsQuotation";
import POSettings from "../controllers/POSettings";

const router = express();
router.use("/DeliveryNoteEntry", DeliveryNoteEntry());
router.use("/PurchaseOrderEntry", PurchaseOrderEntry());
router.use("/ReceiptEntry", ReceiptEntry());
router.use("/PurchaseReturnEntry", PurchaseReturnEntry());
router.use("/RequestForQuotation", RequestForQuotation());
router.use("/VendorsQuotation", VendorsQuotation());
router.use("/POSettings", POSettings());

export default router;
