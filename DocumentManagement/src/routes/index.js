import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
import {
  saveContractDoc,
  getContractDoc,
  deleteContractDoc,
} from "../Controller/contract";
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
});
export default router;
