// 📄 [경로: backend/models/index.js]
import Sequelize from "sequelize";
import * as userModel from "./users.js";
import RefreshToken from "./refreshToken.js";
import dotenv from "dotenv";
dotenv.config();

// ✅ Sequelize 연결 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// 🔧 models 객체로 구성 (확장 가능 구조)
const db = {};

// 🔹 RefreshToken 모델 초기화
db.RefreshToken = RefreshToken(sequelize, Sequelize.DataTypes);

// 🔹 사용자 관련 함수들 통합 export
db.findUserByEmail = userModel.findUserByEmail;
db.createUser = userModel.createUser;
db.saveRefreshToken = userModel.saveRefreshToken;

// 🔹 sequelize 및 Sequelize 클래스도 함께 export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
