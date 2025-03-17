// 📄 errorHandler.js
// 🌟 전역 에러 핸들링 미들웨어
export const errorHandler = (err, req, res, next) => {
  // ✅ 1. 에러 로그 출력 (서버 콘솔)
  console.error("에러핸들러:", err);

  // ✅ 2. 클라이언트에게 JSON 형태의 에러 메시지 반환
  return res.status(500).json({ error: "서버 내부 오류" });

  // 🔹 기본적으로 500(Internal Server Error) 상태 코드 사용
  // 🔹 필요하다면 err.status 값이 존재하면 해당 상태 코드로 변경 가능
};
