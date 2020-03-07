import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
import { setUserPreference, getUserPreferences } from "../Model/userPreference";
const router = express();
initializedDb(db => {
  router.use("/Document", documentManagement(db));
  router.use("/setPreferences", setUserPreference);
  router.use("/getPreferences", getUserPreferences);
});
export default router;
