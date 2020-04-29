import { Router } from "express";
import docs from "../Model/documents";
import logos from "../Model/saveImages";
export default (db) => {
  const api = Router();
  const { saveDocument, getDocument, deleteDocument } = docs(db);
  const { saveLogo, getLogo } = logos(db);
  api.post("/save", saveDocument);
  api.get("/get", getDocument);
  api.delete("/delete", deleteDocument);
  api.post("/saveLogo", saveLogo);
  api.get("/getLogo", getLogo);
  return api;
};
