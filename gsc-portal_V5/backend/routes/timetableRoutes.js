// 📁 backend/routes/timetableRoutes.js
import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../controllers/timetableController.js";

const router = Router();

router.get("/", getAllTimetables); // ?grade=1
router.post("/", authRequired, createTimetable);
router.put("/:id", authRequired, updateTimetable);
router.delete("/:id", authRequired, deleteTimetable);

export default router;
