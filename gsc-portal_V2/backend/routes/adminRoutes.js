// backend/routes/adminRoutes.js
import express from "express";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ 관리자만 접근 가능
router.get(
  "/pending-users",
  authenticateToken,
  checkRole(["관리자", "교수"]),
  getPendingUsers
);
router.post(
  "/approve",
  authenticateToken,
  checkRole(["관리자", "교수"]),
  approveUser
);
router.post(
  "/reject",
  authenticateToken,
  checkRole(["관리자", "교수"]),
  rejectUser
);

export default router;
