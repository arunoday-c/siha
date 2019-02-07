import express from "express";
import myday from "../controllers/myday";
const router = express();
router.use("/myDay", myday());
export default router;
