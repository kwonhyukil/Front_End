import express from "express";
import {
  googleCalendarAuth,
  googleCalendarCallback,
  getGoogleCalendarEvents,
} from "../controllers/calendarController.js";

const router = express.Router();

// ✅ Google 캘린더 연동 요청
router.get("/google/auth", googleCalendarAuth);

// ✅ Google 캘린더 OAuth 콜백
router.get("/google/callback", googleCalendarCallback);

// ✅ Google 캘린더 일정 가져오기
router.get("/events", getGoogleCalendarEvents);

export default router;
