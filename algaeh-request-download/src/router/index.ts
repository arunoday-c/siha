import express from "express";
import controller from "../controller";
const router = express();
router.use("/report", controller());
export default router;
