// 📄 noticeRoutes.js
// ✅ 공지사항 관련 라우트 설정

import { Router } from "express";
import multer from "multer";
import path from "path";
import { authRequired } from "../middleware/authMiddleware.js"; // 🔹 JWT 인증 미들웨어
import {
  getNotices, // 공지사항 목록 조회 + 검색
  getNoticeById, // 개별 공지사항 조회
  createNotice, // 공지사항 작성
  updateNotice, // 공지사항 수정
  deleteNotice, // 공지사항 삭제 (단일)
  deleteNoticesBulk, // 공지사항 삭제 (다중)
  downloadAttachment, // 공지사항 첨부파일 다운로드
} from "../controllers/noticeController.js";

const router = Router();

// ✅ 파일 업로드 설정 (multer 사용)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📂 "uploads/" 폴더에 파일 저장
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // 확장자 유지
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// ✅ 공지사항 목록 조회 (검색 기능 포함)
// - 쿼리스트링으로 학년별 필터링 가능 (?grade=1,2,3) 또는 제목 검색 (?keyword=공지)
router.get("/", getNotices);

// ✅ 특정 공지사항 조회 (조회수 증가 포함)
// - `/notice/:id` 형식으로 요청 시 해당 공지 조회
router.get("/:id", getNoticeById);

// ✅ 공지사항 작성 (첨부파일 포함, 최대 5개까지)
// - JWT 인증 필요 (authRequired)
// - 관리자(1) 또는 교수(2)만 작성 가능
router.post("/", authRequired, upload.array("attachments", 5), createNotice);

// ✅ 공지사항 수정
// - JWT 인증 필요
// - 작성자만 수정 가능
router.put("/:id", authRequired, updateNotice);

// ✅ 공지사항 삭제 (단일 삭제)
// - JWT 인증 필요
// - 관리자(1) 또는 교수(2)만 삭제 가능
router.delete("/:id", authRequired, deleteNotice);

// ✅ 공지사항 다중 삭제
// - 요청 바디에 `ids: [1,2,3]` 형태로 삭제할 공지사항 ID 배열 전달
router.post("/bulk-delete", authRequired, deleteNoticesBulk);

// ✅ 첨부파일 다운로드
// - 공지사항에 첨부된 파일 다운로드 가능
router.get("/download/:attachmentId", authRequired, downloadAttachment);

export default router;
