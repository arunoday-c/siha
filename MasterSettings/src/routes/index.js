import express from "express";
import department from "../controllers/department";
import visitType from "../controllers/visitType";

const router = express();
router.use("/department", department());
router.use("/visitType", visitType());

export default router;
