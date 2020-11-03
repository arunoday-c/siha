import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
import {
  saveContractDoc,
  getContractDoc,
  deleteContractDoc,
} from "../Controller/contract";
import {
  deleteInvoiceDoc,
  getInvoiceDoc,
  saveInvoiceDoc,
} from "../Controller/invoice";
import {
  deleteReceiptEntryDoc,
  getReceiptEntryDoc,
  saveReceiptEntryDoc,
} from "../Controller/receiptEntryDoc";
import {
  deleteRadiologyDoc,
  getRadiologyDoc,
  saveRdiologyDoc,
} from "../Controller/radiologyDoc";
import { setUserPreference, getUserPreferences } from "../Model/userPreference";
import { getLogs } from "../Model/loggers";
const router = express();
initializedDb((db) => {
  router.use("/Document", documentManagement(db));
  router.use("/setPreferences", setUserPreference);
  router.use("/getPreferences", getUserPreferences);
  router.use("/getLogs", getLogs);
  router.post("/saveContractDoc", saveContractDoc);
  router.get("/getContractDoc", getContractDoc);
  router.delete("/deleteContractDoc", deleteContractDoc);
  router.post("/saveInvoiceDoc", saveInvoiceDoc);

  router.get("/getInvoiceDoc", getInvoiceDoc);
  router.delete("/deleteInvoiceDoc", deleteInvoiceDoc);
  router.post("/saveReceiptEntryDoc", saveReceiptEntryDoc);

  router.get("/getRadiologyDoc", getRadiologyDoc);
  router.delete("/deleteRadiologyDoc", deleteRadiologyDoc);
  router.post("/saveRdiologyDoc", saveRdiologyDoc);

  router.get("/getReceiptEntryDoc", getReceiptEntryDoc);
  router.delete("/deleteReceiptEntryDoc", deleteReceiptEntryDoc);
});
export default router;
