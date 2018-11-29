import express, { Router } from "express";
import initializedDb from "../db";
import documentManagement from "../Controller/documents";
const router = express();

initializedDb(db => {
  Router().use((req, res, next) => {
    req.db = db;
    next();
  });
  router.use("/Document", documentManagement(db));
});
export default router;
