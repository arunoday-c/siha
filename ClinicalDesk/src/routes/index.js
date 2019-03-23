import express from "express";
import myday from "../controllers/myday";
import vitals from "../controllers/vitals";
import dashboard from "../controllers/dashboard";
const router = express();
router.use("/myDay", myday());
router.use("/vitals", vitals());
router.use("/dashboard", dashboard());
export default router;
