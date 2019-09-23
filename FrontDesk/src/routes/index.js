import express from "express";
import frontDesk from "../controllers/frontDesk";
import visit from "../controllers/visit";
import patientRegistration from "../controllers/patientRegistration";
import appointment from "../controllers/appointment";
import physiotherapy from "../controllers/physiotherapy";

const router = express();
router.use("/frontDesk", frontDesk());
router.use("/visit", visit());
router.use("/patientRegistration", patientRegistration());
router.use("/appointment", appointment());
router.use("/physiotherapy", physiotherapy());

export default router;
