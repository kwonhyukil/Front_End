// 📄 timetableRoutes.js
// ✅ 시간표 관리 API 라우터

import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js"; // 🔹 JWT 인증 미들웨어
import {
  getAllTimetables,  // 전체 시간표 조회
  getTimetablesByDay, // 특정 요일 시간표 조회
  createTimetable,    // 시간표 등록
  updateTimetable,    // 시간표 수정
  deleteTimetable,    // 시간표 삭제
} from "../controllers/timetableController.js"; // 📌 컨트롤러 연결

const router = Router();

// ✅ 전체 시간표 조회
// - 기본 시간표를 조회하며, 요일 순서대로 정렬됨
router.get("/", getAllTimetables);

// ✅ 특정 요일의 시간표 조회
// - /timetable/월, /timetable/화 등의 형식으로 요청 가능
router.get("/:day_of_week", getTimetablesByDay);

// ✅ 시간표 등록 (JWT 인증 필요)
// - 관리자(1) 또는 교수(2)만 등록 가능
router.post("/", authRequired, createTimetable);

// ✅ 시간표 수정 (JWT 인증 필요)
// - 관리자(1) 또는 교수(2)만 수정 가능
router.put("/:id", authRequired, updateTimetable);

// ✅ 시간표 삭제 (JWT 인증 필요)
// - 관리자(1) 또는 교수(2)만 삭제 가능
router.delete("/:id", authRequired, deleteTimetable);

export default router;
