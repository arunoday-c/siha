import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
import { setUserPreference, getUserPreferences } from "../Model/userPreference";
import { getLogs } from "../Model/loggers";
const router = express();
initializedDb(db => {
  router.use("/Document", documentManagement(db));
  router.use("/setPreferences", setUserPreference);
  router.use("/getPreferences", getUserPreferences);
  router.use("/getLogs", getLogs);
});
export default router;
