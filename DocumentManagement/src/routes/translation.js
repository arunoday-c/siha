import express, { Router } from "express";
import {
  getTranslation,
  getAll,
  addTranslation,
  updateTranslation,
  getPath,
  deleteTranslation,
} from "../Controller/translation";
const api = Router();

api.get(["/paths/"], getPath);
// crud
api.post(["/add"], addTranslation);
api.get("/:lang", getTranslation);
api.get("/", getAll);
api.post("/:id", updateTranslation);
api.delete("/:id", deleteTranslation);

export default express().use("/", api);
