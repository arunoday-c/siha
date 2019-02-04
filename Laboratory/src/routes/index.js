import express from "express";
import laboratory from "../controllers/laboratory";
import labmasters from "../controllers/labmasters";

const router = express();
router.use("/laboratory", laboratory());
router.use("/labmasters", labmasters());

export default router;
