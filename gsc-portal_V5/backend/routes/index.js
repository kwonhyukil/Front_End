// [경로: backend/routes/index.js]
import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import calendarRoutes from "./calendarRoutes.js";
import timetableRoutes from "./timetableRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/notice", noticeRoutes); // ✅ 경로 변경
router.use("/timetables", timetableRoutes);
router.use("/calendar", calendarRoutes);

export default router;
