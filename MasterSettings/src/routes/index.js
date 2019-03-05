import express from "express";
import department from "../controllers/department";
import visitType from "../controllers/visitType";
import visaType from "../controllers/visaType";
import identity from "../controllers/identity";
import patientType from "../controllers/patientType";
import vendor from "../controllers/vendor";
import serviceType from "../controllers/serviceTypes";

const router = express();
router.use("/department", department());
router.use("/visitType", visitType());
router.use("/visaType", visaType());
router.use("/identity", identity());
router.use("/patientType", patientType());
router.use("/vendor", vendor());
router.use("/serviceType", serviceType());

export default router;
