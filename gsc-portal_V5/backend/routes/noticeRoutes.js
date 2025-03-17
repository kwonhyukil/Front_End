// [경로: backend/routes/noticeRoutes.js]
import { Router } from "express";
import multer from "multer";
import path from "path";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  deleteNoticesBulk,
  downloadAttachment,
} from "../controllers/noticeController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 공지사항 목록
router.get("/", getNotices);
// 단일 조회
router.get("/:id", getNoticeById);
// 작성
router.post("/", authRequired, upload.array("attachments", 5), createNotice);
// 수정
router.put("/:id", authRequired, updateNotice);
// 삭제(단일)
router.delete("/:id", authRequired, deleteNotice);
// 삭제(다중)
router.post("/bulk-delete", authRequired, deleteNoticesBulk);
// 첨부파일 다운로드
router.get("/download/:attachmentId", authRequired, downloadAttachment);

export default router;
