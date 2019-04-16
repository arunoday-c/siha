import { Router } from "express";
import docs from "../Model/documents";
export default db => {
  const api = Router();
  api.post("/save", docs(db).saveDocument);
  api.get("/get", docs(db).getDocument);
  api.delete("/delete", docs(db).deleteDocument);
  return api;
};
