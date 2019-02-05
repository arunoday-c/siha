import express from "express";
import inventory from "../controllers/inventory";

const router = express();
router.use("/inventory", inventory());

export default router;
