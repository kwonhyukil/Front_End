// backend/controllers/authController.js
import {
  getUserByEmail,
  getPendingUserByEmail,
  registerPendingUserService,
  approveUserRegistration,
  updateLastLogin,
  updateUserRefreshToken,
} from "../services/authService.js";
import { generateTokens } from "../utils/jwtUtils.js";
import { validateEmailDomain } from "../utils/emailUtils.js";
import { getGoogleUser, getGoogleAuthUrl } from "../utils/googleOAuth.js";
import jwt from "jsonwebtoken";

export const googleLogin = (req, res) => {
  const authUrl = getGoogleAuthUrl();
  return res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code)
      return res.status(400).json({ error: "Authorization code missing" });

    // 구글에서 사용자 정보
    const userInfo = await getGoogleUser(code);
    if (!userInfo)
      return res.status(500).json({ error: "사용자 정보 요청 실패" });
    const { email, name } = userInfo;

    // 이메일 도메인 검사
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ error: "Invalid email domain" });
    }

    const user = await getUserByEmail(email);
    if (user) {
      // 기존 사용자
      await updateLastLogin(email);

      const { accessToken, refreshToken } = generateTokens(user);
      await updateUserRefreshToken(email, refreshToken);

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    }

    // 가입 대기 상태인지 확인
    const pendingUser = await getPendingUserByEmail(email);
    if (pendingUser) {
      return res.status(400).json({ error: "Pending registration" });
    }

    // 신규 사용자 → 회원가입 페이지 이동
    return res.redirect(`${process.env.FRONTEND_URL}/register`);
  } catch (error) {
    console.error("❌ Google OAuth 오류:", error.message);
    return res.status(500).json({ error: "Google 로그인 실패" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, studentid, phone, year, status, role } = req.body;
    if (!name || !email || !studentid || !phone || !year || !status || !role) {
      return res.status(400).json({ error: "모든 필드를 입력하세요." });
    }

    // 중복체크
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "이미 가입된 사용자입니다." });
    }

    // 가입 신청
    await registerPendingUserService({
      name,
      email,
      studentid,
      phone,
      year,
      status,
      role,
    });

    // 특정 이메일 gurdlf320@g.yju.ac.kr => 관리자 자동 승인
    if (email === "gurdlf320@g.yju.ac.kr") {
      const { success, token, refreshToken } = await approveUserRegistration(
        email
      );
      if (success) {
        return res
          .status(201)
          .json({ message: "관리자 계정 승인 완료", token, refreshToken });
      }
    }

    return res
      .status(201)
      .json({ message: "회원가입 신청 완료. 관리자 승인 후 로그인 가능" });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error.message);
    return res.status(500).json({ error: "서버 오류 발생" });
  }
};

// ✅ 사용자 정보 조회 (JWT 인증)
export const getUser = async (req, res) => {
  try {
    const { email } = req.user; // JWT에서 추출
    const user = await getUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    res.json({ user });
  } catch (error) {
    console.error("❌ 사용자 정보 조회 오류:", error.message);
    res.status(500).json({ error: "사용자 정보를 불러오는 중 오류" });
  }
};

// ✅ Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const rToken = req.headers.authorization?.split(" ")[1];
    if (!rToken)
      return res.status(401).json({ error: "Refresh Token이 필요합니다." });

    jwt.verify(rToken, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return res.status(403).json({ error: "유효하지 않은 Refresh Token" });
      const user = await getUserByEmail(decoded.email);
      if (!user)
        return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      await updateUserRefreshToken(user.email, newRefreshToken);
      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    console.error("❌ Refresh Token 오류:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

// ✅ 로그아웃
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "로그아웃 실패" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URL);
    });
  });
};
