import express from "express";
import clinicalDesk from "../controllers/clinicalDesk";
import myDay from "../controllers/myday";
import myday from "../controllers/myday";
const router = express();
router.use("/clinicalDesk", clinicalDesk());
router.use("/myDay", myday);
export default router;
