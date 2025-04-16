import express from "express";

console.log("✅ calendarRoutes.js 라우트 파일 로딩됨");

const router = express.Router();

router.get("/events", (req, res) => {
  console.log("📆 /calendar/events 호출됨");
  res.json({ message: "캘린더 라우트 OK!" });
});

export default router;
