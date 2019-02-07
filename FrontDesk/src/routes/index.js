import express from "express";
import frontDesk from "../controllers/frontDesk";
import visit from "../controllers/visit";

const router = express();
router.use("/frontDesk", frontDesk());
router.use("/visit", visit());

export default router;
