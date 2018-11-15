import express from "express";
import initializedDb from "../db";
const router = express();
initializedDb(db => {
  router.use("/SaveDocument");
});
