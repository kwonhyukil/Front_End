// 📁 [경로: backend/middleware/errorHandler.js]
export function errorHandler(err, req, res, next) {
  console.error("🚨 에러 핸들러:", err);
  res.status(500).json({
    error: "서버 내부 오류",
    detail: err.message,
  });
}
