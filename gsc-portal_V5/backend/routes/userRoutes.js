// [경로: backend/routes/userRoutes.js]
import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  saveRegistration,
  approveRegistration,
  rejectRegistration,
  getUserProfile,
  getRegistrations,
} from "../controllers/userController.js";

const router = Router();

// 임시 회원가입 정보 저장
router.post("/registration", saveRegistration);

// 관리자 승인/거부
router.put("/registration/approve/:id", authRequired, approveRegistration);
router.put("/registration/reject/:id", authRequired, rejectRegistration);

// 등록 대기 목록 (관리자 전용)
router.get("/registrations", authRequired, getRegistrations);

// 사용자 프로필 (승인된 사용자)
router.get("/profile", authRequired, getUserProfile);

export default router;
