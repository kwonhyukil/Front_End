// [경로: backend/routes/calendarRoutes.js]
import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendarController.js";

const router = Router();

router.get("/", authRequired, getCalendarEvents);
router.post("/", authRequired, createCalendarEvent);
router.put("/:id", authRequired, updateCalendarEvent);
router.delete("/:id", authRequired, deleteCalendarEvent);

export default router;
