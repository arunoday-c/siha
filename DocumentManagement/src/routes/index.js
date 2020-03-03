import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
import { setUserPreference } from "../Model/userPreference";
const router = express();
initializedDb(db => {
  router.use("/Document", documentManagement(db));
  router.use(
    "/setPreferences",
    (req, res, next) => {
      console.log("Here");
      next();
    },
    setUserPreference
  );
});
export default router;
