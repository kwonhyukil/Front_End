import express from "express";
import {
  getScheduleByUser,
  addSchedule,
} from "../controllers/scheduleController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 사용자별 시간표 조회 (로그인 필요)
router.get("/", authenticateToken, getScheduleByUser);

// 🔹 교수/관리자가 시간표 추가 가능
router.post("/", authenticateToken, addSchedule);

export default router;
