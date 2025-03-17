// [경로: backend/routes/scheduleRoutes.js]
import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleControler.js";

const router = Router();

router.get("/", getSchedules);
router.post("/", authRequired, createSchedule);
router.put("/:id", authRequired, updateSchedule);
router.delete("/:id", authRequired, deleteSchedule);

export default router;
