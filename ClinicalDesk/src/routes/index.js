import express from "express";
import myday from "../controllers/myday";
import vitals from "../controllers/vitals";
const router = express();
router.use("/myDay", myday());
router.use("/vitals", vitals());
export default router;
