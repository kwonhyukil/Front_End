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

/**
 * ✅ Google OAuth 로그인 요청
 */
export const googleLogin = (req, res) => {
  const googleAuthUrl = getGoogleAuthUrl();
  res.redirect(googleAuthUrl);
};

/**
 * ✅ Google OAuth 콜백 처리 (JWT 발급 포함)
 */
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // Google 에서 사용자 정보 가져오기
    const userInfo = await getGoogleUser(code);
    if (!userInfo) {
      return res.status(500).json({ error: "사용자 정보 요청 실패" });
    }

    const { email } = userInfo;

    // 이메일 도메인 검증
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ error: "Invalid email domain" });
    }

    // 🔹 기존 사용자 확인
    const user = await getUserByEmail(email);
    if (user) {
      await updateLastLogin(email);

      // ✅ JWT 발급
      const { accessToken, refreshToken } = generateTokens(user);
      await updateUserRefreshToken(email, refreshToken);

      console.log("✅ JWT 발급 완료:", accessToken);
      console.log("✅ Refresh Token 저장 완료:", refreshToken);

      // ✅ 프론트엔드로 리다이렉트 (URL 쿼리에 토큰 전달)
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    }

    // 🔹 회원가입 신청 여부 확인
    const pendingUser = await getPendingUserByEmail(email);
    if (pendingUser) {
      console.log("📌 회원가입 신청된 사용자. 승인 필요.");
      return res.status(400).json({ error: "Pending registration" });
    }

    // 🔹 신규 유저 → 회원가입 페이지로 이동
    console.log("📌 신규 사용자. 회원가입 페이지 이동.");
    return res.redirect(`${process.env.FRONTEND_URL}/register`);
  } catch (error) {
    console.error("❌ Google OAuth 오류:", error.message);
    return res.status(500).json({ error: "Google 로그인 실패" });
  }
};
/**
 * ✅ 회원가입
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, studentid, phone, year, status, role } = req.body;

    // 🔹 기본 검증
    if (!name || !email || !studentid || !phone || !year || !status || !role) {
      return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
    }

    // 🔹 이미 가입된 사용자 확인
    if (await getUserByEmail(email)) {
      return res.status(400).json({ error: "이미 가입된 사용자입니다." });
    }

    // 🔹 회원가입 신청
    await registerPendingUserService({
      name,
      email,
      studentid,
      phone,
      year,
      status,
      role,
    });

    // 🔹 특정 이메일은 즉시 승인
    if (email === "gurdlf320@g.yju.ac.kr") {
      const { success, token, refreshToken } = await approveUserRegistration(
        email
      );
      if (success) {
        await updateUserRefreshToken(email, refreshToken);
        return res
          .status(201)
          .json({ message: "관리자 승인 완료", token, refreshToken });
      }
    }

    return res.status(201).json({
      message: "회원가입 신청 완료. 관리자 승인 후 로그인 가능합니다.",
    });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error.message);
    return res.status(500).json({ error: "서버 오류 발생" });
  }
};

/**
 * ✅ 사용자 정보 조회 (JWT 인증 필요)
 */
export const getUser = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res.json({ user });
  } catch (error) {
    console.error("❌ 사용자 정보 조회 오류:", error.message);
    res.status(500).json({ error: "사용자 정보를 불러오는 중 오류 발생" });
  }
};

/**
 * ✅ JWT 갱신 (Refresh Token)
 */
export const refreshToken = async (req, res) => {
  try {
    const rToken = req.headers.authorization?.split(" ")[1];
    if (!rToken) {
      return res.status(401).json({ error: "Refresh Token이 필요합니다." });
    }

    jwt.verify(rToken, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "유효하지 않은 Refresh Token" });
      }

      const user = await getUserByEmail(decoded.email);
      if (!user) {
        return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      await updateUserRefreshToken(user.email, newRefreshToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    console.error("❌ Refresh Token 오류:", error.message);
    return res.status(500).json({ error: "서버 오류 발생" });
  }
};

/**
 * ✅ 로그아웃 기능
 */
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "로그아웃 실패" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URL);
    });
  });
};
