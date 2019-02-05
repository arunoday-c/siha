import express from "express";
import department from "../controllers/department";

const router = express();
router.use("/department", department());

export default router;
