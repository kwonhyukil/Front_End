import express from "express";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendarController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// 캘린더 이벤트 조회
router.get("/events", authRequired, getCalendarEvents);

// 캘린더 이벤트 생성
router.post("/events", authRequired, createCalendarEvent);

// 캘린더 이벤트 수정
router.put("/events/:eventId", authRequired, updateCalendarEvent);

// 캘린더 이벤트 삭제
router.delete("/events/:eventId", authRequired, deleteCalendarEvent);

export default router;
