import express from "express";
import department from "../controllers/department";
import visitType from "../controllers/visitType";
import identity from "../controllers/identity";
import patientType from "../controllers/patientType";

const router = express();
router.use("/department", department());
router.use("/visitType", visitType());
router.use("/identity", identity());
router.use("/patientType", patientType());

export default router;
