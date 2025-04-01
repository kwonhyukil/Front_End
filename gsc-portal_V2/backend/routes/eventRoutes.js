import express from "express";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ 학과 행사 일정 조회 (모든 사용자 가능)
router.get("/", authenticateToken, getEvents);

// ✅ 학과 행사 일정 추가 (관리자, 교수만 가능)
router.post("/", authenticateToken, checkRole(["관리자", "교수"]), createEvent);

// ✅ 학과 행사 일정 수정 (관리자, 교수만 가능)
router.put(
  "/:id",
  authenticateToken,
  checkRole(["관리자", "교수"]),
  updateEvent
);

// ✅ 학과 행사 일정 삭제 (관리자, 교수만 가능)
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["관리자", "교수"]),
  deleteEvent
);

export default router;
