import express from "express";

import bedMaster from "../controller/bedmaster";
import patAdmission from "../controller/patAdmission";

const router = express();
router.use("/bedManagement", bedMaster());
router.use("/patAdmission", patAdmission());

export default router;
