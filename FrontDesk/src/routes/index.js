import express from "express";
import frontDesk from "../controllers/frontDesk";

const router = express();
router.use("/frontDesk", frontDesk());

export default router;
