import express from "express";
import laboratory from "../controllers/laboratory";
import labmasters from "../controllers/labmasters";
import investigation from "../controllers/investigation";
import LisIntegration from "../controllers/LisIntegration";

const router = express();
router.use("/laboratory", laboratory());
router.use("/labmasters", labmasters());
router.use("/investigation", investigation());
router.use("/LisIntegration", LisIntegration());

export default router;
