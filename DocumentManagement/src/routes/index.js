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
import { uploadFile, getUploadedFile } from "../files/index";
import {
  uploadSubDeptImg,
  getUploadedSubFile,
  deleteSubDeptImage,
} from "../files/subdept";
import { uploadInvItemImg, deleteInvItemImg } from "../files/invItemMaster";
// import { uploadFile, getUploadedFile } from "../files";
import {
  uploadDocumentCommon,
  deleteCommonFile,
  getUploadedCommonFile,
  uploadFromFilePath,
} from "../files/docUploadingCommon";
import {
  uploadPatientDoc,
  getUploadedPatientFiles,
  downloadPatDocument,
  deletePatientDocs,
  deleteMultipleFiles,
} from "../files/patientDocumentsUpload";

import {
  uploadEmployeeDoc,
  getUploadedEmployeeFiles,
  downloadEmployeeDocument,
  deleteEmployeeDocs,
  deleteMultipleFilesEmp,
  updateDocumentNamePhysical,
} from "../files/employeedDocumentsUpload";

import {
  getAllNotifications,
  deleteNotification,
  seenNotification,
} from "../Model/notifications";
const router = express();
initializedDb((db) => {
  router.use("/Document", documentManagement(db));
  router.use("/setPreferences", setUserPreference);
  router.use("/getPreferences", getUserPreferences);
  router.use("/getLogs", getLogs);
  router.post("/saveContractDoc", uploadFile); //saveContractDoc);
  router.get("/getContractDoc", getUploadedFile); // getContractDoc);
  router.post("/uploadSubDeptImg", uploadSubDeptImg);
  router.post("/uploadInvItemImg", uploadInvItemImg);

  router.delete("/deleteInvItemImg", deleteInvItemImg);
  router.get("/uploadFromFilePath", uploadFromFilePath);
  router.post("/uploadDocumentCommon", uploadDocumentCommon);
  router.post("/uploadPatientDoc", uploadPatientDoc);
  router.get("/getUploadedPatientFiles", getUploadedPatientFiles);
  router.get("/downloadPatDocument", downloadPatDocument);
  router.delete("/deletePatientDocs", deletePatientDocs);
  router.delete("/deleteMultipleFiles", deleteMultipleFiles);

  router.post("/uploadEmployeeDoc", uploadEmployeeDoc);
  router.get("/getUploadedEmployeeFiles", getUploadedEmployeeFiles);
  router.get("/downloadEmployeeDocument", downloadEmployeeDocument);
  router.delete("/deleteEmployeeDocs", deleteEmployeeDocs);
  router.delete("/deleteMultipleFilesEmp", deleteMultipleFilesEmp);
  router.get("/updateDocumentNamePhysical", updateDocumentNamePhysical);

  router.get("/getUploadedCommonFile", getUploadedCommonFile);
  router.delete("/deleteCommonFile", deleteCommonFile);
  router.get("/getUploadedSubFile", getUploadedSubFile);
  router.delete("/deleteContractDoc", deleteContractDoc);
  router.delete("/deleteSubDeptImage", deleteSubDeptImage);
  router.post("/saveInvoiceDoc", saveInvoiceDoc);

  router.get("/getInvoiceDoc", getInvoiceDoc);
  router.delete("/deleteInvoiceDoc", deleteInvoiceDoc);
  router.post("/saveReceiptEntryDoc", saveReceiptEntryDoc);

  router.get("/getRadiologyDoc", getRadiologyDoc);
  router.delete("/deleteRadiologyDoc", deleteRadiologyDoc);
  router.post("/saveRdiologyDoc", saveRdiologyDoc);

  router.get("/getReceiptEntryDoc", getReceiptEntryDoc);
  router.delete("/deleteReceiptEntryDoc", deleteReceiptEntryDoc);
  router.get("/getAllNotifications", getAllNotifications);
  router.post("/seenNotification", seenNotification);
  router.delete("/deleteNotification", deleteNotification);
});
export default router;
