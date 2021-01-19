import { Router } from "express";
const router = Router();
import {
  insertToScheduler,
  updateToScheduler,
  getToScheduler,
} from "../settings";
import { scheduler } from "../scheduler";
router.post("/pushSchedule", insertToScheduler);
router.put("/updateSchedule", updateToScheduler);
router.get("/get", getToScheduler);
router.get("/startOrStopJobs", scheduler);
export default router;
