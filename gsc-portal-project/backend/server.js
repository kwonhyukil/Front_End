require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { frontendURL, googleRedirectURI } = require("./config/keys");

require("./config/passport");

const authRoutes = require("./routes/auth");

const app = express();

// 🔹 HTTPS 강제 리디렉션 제거 (로컬 개발 환경에서 필요 없음)
// ✅ trust proxy 설정은 유지 (배포 환경에서 필요할 수도 있음)
app.enable("trust proxy");

// 🔹 세션 설정
app.use(
  session({
    secret: process.env.JWT_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // 로컬 환경에서는 `false` (배포 시 `true`)
      httpOnly: true,
    },
  })
);

// 🔹 Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());

// 🔹 CORS 설정 (preflight 문제 해결)
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false, // Preflight 요청이 OPTIONS 요청을 계속 진행하지 않도록 설정
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 API 라우트 등록
app.use("/auth", authRoutes);

// 🔹 기본 루트 엔드포인트 추가
app.get("/", (req, res) => {
  res.send("✅ GSC Portal Backend Server is running!");
});

// 🔹 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 FRONTEND_URL: ${frontendURL}`);
  console.log(`🔗 GOOGLE_REDIRECT_URI: ${googleRedirectURI}`);
});
