const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// DB 연결 및 서버 시작
sequelize
  .sync()
  .then(() => {
    console.log("✅ MySQL 연결 성공 & 모델 동기화 완료");
    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB 연결 실패:", err);
  });
