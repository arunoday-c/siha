import express from "express";
import test from "../controllers/test";

const router = express();
router.use("/test", test());

export default router;
