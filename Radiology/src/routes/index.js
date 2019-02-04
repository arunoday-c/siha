import express from "express";
import radiology from "../controllers/radiology";

const router = express();
router.use("/radiology", radiology());

export default router;
