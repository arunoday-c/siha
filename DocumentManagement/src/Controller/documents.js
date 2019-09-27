import { Router } from "express";
import docs from "../Model/documents";
export default db => {
  const api = Router();
  const { saveDocument, getDocument, deleteDocument } = docs(db);
  api.post("/save", saveDocument);
  api.get("/get", getDocument);
  api.delete("/delete", deleteDocument);
  return api;
};
