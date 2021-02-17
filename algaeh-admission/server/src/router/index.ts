import express from "express";

import bedMaster from "../controller/bedmaster";

const router = express();
router.use("/bedManagement", bedMaster());

export default router;
