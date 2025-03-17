// [경로: backend/server.js]
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./config/dotenv.js";

const { PORT, FRONTEND_URL, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// uploads 폴더 정적 제공
app.use("/uploads", express.static("uploads"));

// Passport
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// 라우트
app.use("/", (req, res, next) => {
  if (req.path === "/") {
    return res.send("GSC 포털 백엔드 API");
  }
  next();
});
app.use(router);

// 에러핸들러
app.use(errorHandler);

// 실행
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
