// 📄 scheduleRoutes.js
// ✅ 시간표 관련 API 라우터

import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js"; // 🔹 JWT 인증 미들웨어
import {
  getSchedules, // 시간표 조회
  createSchedule, // 시간표 등록
  updateSchedule, // 시간표 수정
  deleteSchedule, // 시간표 삭제
} from "../controllers/scheduleController.js"; // 📌 오타 수정 (scheduleControler.js → scheduleController.js)

const router = Router();

// ✅ 정규 시간표 조회
// - 학년별 필터링 가능 (?grade=1,2,3 or all)
router.get("/", getSchedules);

// ✅ 시간표 등록
// - JWT 인증 필요 (authRequired)
// - 관리자(1) 또는 교수(2)만 등록 가능
router.post("/", authRequired, createSchedule);

// ✅ 시간표 수정
// - JWT 인증 필요
// - 관리자(1) 또는 교수(2)만 수정 가능
router.put("/:id", authRequired, updateSchedule);

// ✅ 시간표 삭제
// - JWT 인증 필요
// - 관리자(1) 또는 교수(2)만 삭제 가능
router.delete("/:id", authRequired, deleteSchedule);

export default router;
