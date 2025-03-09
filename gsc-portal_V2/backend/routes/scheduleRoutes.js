import express from "express";
import { getSchedule, addSchedule } from "../controllers/scheduleController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ 전체 시간표 가져오기
router.get("/", authenticateToken, getSchedule);

// ✅ 새 시간표 추가 (관리자/교수만)
router.post("/", authenticateToken, checkRole(["관리자", "교수"]), addSchedule);

export default router;
