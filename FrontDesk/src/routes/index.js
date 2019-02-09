import express from "express";
import frontDesk from "../controllers/frontDesk";
import visit from "../controllers/visit";
import patientRegistration from "../controllers/patientRegistration";

const router = express();
router.use("/frontDesk", frontDesk());
router.use("/visit", visit());
router.use("/patientRegistration", patientRegistration());

export default router;
