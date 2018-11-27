import express from "express";
import initializedDb from "../db";
import saveDocument from "../Model/documents";
const router = express();
initializedDb(db => {
  router.use("/SaveDocument", saveDocument);
});
