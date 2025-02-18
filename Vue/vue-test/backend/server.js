const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 본문 파싱

// API 라우트 설정
app.use("/api/users", userRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
