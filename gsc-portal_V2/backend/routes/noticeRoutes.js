import express from "express";
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js"; // JWT 인증 미들웨어

const router = express.Router();

// ✅ 공지사항 조회
router.get("/", getNotices);
router.get("/:id", getNoticeById);

// ✅ 공지사항 작성 (교수 & 관리자만 가능)
router.post("/", authenticateToken, createNotice);

// ✅ 공지사항 수정 (작성자만 가능)
router.put("/:id", authenticateToken, updateNotice);

// ✅ 공지사항 삭제 (작성자만 가능)
router.delete("/:id", authenticateToken, deleteNotice);

export default router;
