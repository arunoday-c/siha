import express from "express";
import clinicalDesk from "../controllers/clinicalDesk";

const router = express();
router.use("/clinicalDesk", clinicalDesk());

export default router;
