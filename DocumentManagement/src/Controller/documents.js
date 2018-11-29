import { Router } from "express";
import { saveDocument } from "../Model/documents";
export default db => {
  const api = Router();

  api.post("/save", saveDocument);
  return api;
};
