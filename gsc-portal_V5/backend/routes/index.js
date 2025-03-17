// [경로: backend/routes/index.js]
import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import calendarRoutes from "./calendarRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/notice", noticeRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/calendar", calendarRoutes);

export default router;
