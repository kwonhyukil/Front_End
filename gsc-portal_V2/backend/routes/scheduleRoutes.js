import express from "express";
import {
  getSchedule,
  addSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

export default (io) => {
  // ✅ 전체 시간표 가져오기
  router.get("/", authenticateToken, getSchedule);

  // ✅ 시간표 추가 (관리자/교수만 가능)
  router.post(
    "/",
    authenticateToken,
    checkRole(["관리자", "교수"]),
    (req, res) => addSchedule(req, res, io)
  );

  // ✅ 시간표 삭제 (관리자/교수만 가능)
  router.delete(
    "/:id",
    authenticateToken,
    checkRole(["관리자", "교수"]),
    (req, res) => deleteSchedule(req, res, io)
  );

  return router;
};
