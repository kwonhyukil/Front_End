import axios from "axios";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import pool from "../config/db.js";

/**
 * ✅ Google OAuth 로그인 URL 생성 및 리디렉트
 */
export const googleLogin = (req, res) => {
  if (!keys.googleClientID || !keys.googleRedirectURI) {
    return res
      .status(500)
      .json({ error: "Google OAuth 설정이 누락되었습니다." });
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    keys.googleClientID
  }&redirect_uri=${encodeURIComponent(
    keys.googleRedirectURI
  )}&response_type=code&scope=openid email profile&prompt=consent`;

  console.log("🔗 Google 로그인 URL:", googleAuthUrl);
  res.redirect(googleAuthUrl);
};

/**
 * ✅ Google OAuth 콜백 처리 (Authorization Code 한 번만 사용)
 */
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("✅ Authorization Code 수신:", code);

    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // 🔹 Authorization Code가 이미 사용되었는지 확인
    if (req.session && req.session.lastAuthCode === code) {
      console.error("❌ Authorization Code 재사용 방지 (이미 사용됨)");
      return res
        .status(400)
        .json({ error: "Authorization code has already been used" });
    }

    // 🔹 Google에서 Access Token 요청
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: keys.googleClientID,
        client_secret: keys.googleClientSecret,
        redirect_uri: keys.googleRedirectURI,
        grant_type: "authorization_code",
        code: code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!tokenResponse.data.access_token) {
      console.error("❌ Google Access Token 발급 실패!");
      return res.status(500).json({ error: "Google Access Token 발급 실패" });
    }

    console.log("✅ Google Access Token:", tokenResponse.data.access_token);

    // 🔹 Google에서 사용자 정보 가져오기
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      }
    );

    if (!userInfoResponse.data) {
      console.error("❌ 사용자 정보를 가져올 수 없습니다.");
      return res.status(500).json({ error: "사용자 정보 요청 실패" });
    }

    const { id, name, given_name, family_name, picture } =
      userInfoResponse.data;
    console.log("👤 Google 사용자 정보:", userInfoResponse.data);

    // 🔹 JWT 생성 (email 제외) ✅ 수정: email 제외
    const token = jwt.sign(
      {
        user: {
          id,
          name,
          given_name,
          family_name,
          picture,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🔑 JWT 생성 완료:", token);

    // ✅ 세션에 Authorization Code 저장 (재사용 방지)
    if (req.session) {
      req.session.lastAuthCode = code;
    }

    // ✅ JWT를 프론트엔드 `/auth/callback`으로 리디렉트
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}`
    );
  } catch (error) {
    console.error(
      "❌ Google OAuth 오류:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      error: "Google 로그인 실패",
      details: error.response ? error.response.data : error.message,
    });
  }
};

/**
 * ✅ 로그아웃 기능
 */
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "로그아웃 실패" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // ✅ 세션 쿠키 삭제
      res.redirect(process.env.FRONTEND_URL); // ✅ 프론트엔드 메인으로 리디렉트
    });
  });
};

/**
 * ✅ 사용자 정보 가져오기 (JWT 인증)
 */
export const getUser = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    console.log("🔍 Authorization 헤더:", authHeader);
    console.log("🔑 Extracted Token:", token);

    if (!token) return res.status(401).json({ error: "토큰이 없습니다." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ 토큰 검증 성공:", decoded);

    res.json({ user: decoded.user });
  } catch (error) {
    console.error("❌ JWT 검증 실패:", error.message);
    res.status(401).json({ error: "인증 실패" });
  }
};
