import express from "express";
import myday from "../controllers/myday";
import vitals from "../controllers/vitals";
import dashboard from "../controllers/dashboard";
import orderAndPreApproval from "../controllers/orderAndPreApproval";

const router = express();
router.use("/myDay", myday());
router.use("/vitals", vitals());
router.use("/dashboard", dashboard());
router.use("/orderAndPreApproval", orderAndPreApproval());
export default router;
