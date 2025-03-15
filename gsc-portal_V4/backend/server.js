// 📄 server.js
// ✅ Express.js 기반 GSC 포털 백엔드 서버

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import router from "./routes/index.js"; // 📌 모든 라우트 통합
import { errorHandler } from "./middleware/errorHandler.js"; // 📌 에러 핸들링 미들웨어
import "./config/dotenv.js"; // 📌 환경변수 로드 (dotenv 설정)

const { PORT, FRONTEND_URL, SESSION_SECRET } = process.env;

const app = express();

// ✅ JSON 파싱 미들웨어 (클라이언트 요청의 body를 JSON으로 해석)
app.use(express.json());

// ✅ CORS 설정 (프론트엔드 도메인에서 요청 허용)
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// ✅ 정적 파일 제공 (첨부파일 다운로드를 위한 uploads 폴더)
app.use("/uploads", express.static("uploads"));

// ✅ 세션 & Passport 설정 (구글 로그인 세션 사용)
app.use(
  session({
    secret: SESSION_SECRET, // 세션 암호화 키
    resave: false, // 매 요청마다 세션 저장 여부 (false 권장)
    saveUninitialized: false, // 초기화되지 않은 세션 저장 여부 (false 권장)
  })
);
app.use(passport.initialize()); // Passport 초기화
app.use(passport.session()); // Passport 세션 사용

// ✅ 기본 라우트 ("/" 경로 요청 시 응답 반환)
app.use("/", (req, res, next) => {
  if (req.path === "/") {
    return res.send("GSC 포털 백엔드 API 서버입니다.");
  }
  next();
});

// ✅ API 라우트 설정 (각종 엔드포인트 연결)
app.use(router);

// ✅ 전역 에러 핸들러 (에러 발생 시 JSON 응답 반환)
app.use(errorHandler);

// ✅ 서버 실행 (PORT 환경변수에서 설정한 포트에서 실행)
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
