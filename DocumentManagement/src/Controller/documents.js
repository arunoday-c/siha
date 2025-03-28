import { Router } from "express";
import docs from "../Model/documents";
import logos from "../Model/saveImages";
import KPI from "../Model/docs/index";

export default (db) => {
  const api = Router();
  const {
    saveDocument,
    getDocument,
    deleteDocument,
    getEmailConfig,
    setEmailConfig,
  } = docs(db);
  const { saveLogo, getLogo } = logos(db);
  const {
    saveDocumentKPI,
    getDocumentKPI,
    saveDocumentMaster,
    getDocumentById,
    getDocumentMasterById,
    saveCertificateIssued,
    getCertificateIssuedList,
  } = KPI(db);
  api.post("/save", saveDocument);
  api.get("/get", getDocument);
  api.delete("/delete", deleteDocument);
  api.post("/saveLogo", saveLogo);
  api.get("/getLogo", getLogo);
  api.post("/saveKPI", saveDocumentKPI);
  api.get("/getKPI", getDocumentKPI);
  api.post("/saveKPIMaster", saveDocumentMaster);
  api.get("/getDocumentById", getDocumentById);
  api.get("/getDocumentMasterById", getDocumentMasterById);
  api.post("/saveCertificateIssued", saveCertificateIssued);
  api.get("/getIssuedCertificates", getCertificateIssuedList);
  api.get("/getEmailConfig", getEmailConfig);
  api.post("/setEmailConfig", setEmailConfig);
  return api;
};
