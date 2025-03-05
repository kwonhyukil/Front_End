import {
  getUserByEmail,
  getPendingUserByEmail,
  registerPendingUserService,
  updateUserRefreshToken,
  updateLastLogin,
} from "../services/authService.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtUtils.js";
import { validateEmailDomain } from "../utils/emailUtils.js";
import { getGoogleUser, getGoogleAuthUrl } from "../utils/googleOAuth.js";

/**
 * ✅ Google OAuth 로그인 요청
 */
export const googleLogin = (req, res) => {
  const googleAuthUrl = getGoogleAuthUrl();
  res.redirect(googleAuthUrl);
};

/**
 * ✅ Google OAuth 콜백 처리
 */
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const userInfo = await getGoogleUser(code);
    if (!userInfo) {
      return res.status(500).json({ error: "사용자 정보 요청 실패" });
    }

    const { email } = userInfo;

    // 🔹 이메일 도메인 검증
    if (!validateEmailDomain(email)) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=invalid_domain`
      );
    }

    // 🔹 기존 사용자 확인 (users 테이블 조회)
    let user = await getUserByEmail(email);
    if (user) {
      await updateLastLogin(email);
      return res.redirect(`${process.env.FRONTEND_URL}/register`);
    }

    // ✅ Access & Refresh Token 발급
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ Refresh Token을 DB에 저장
    await updateUserRefreshToken(email, refreshToken);

    // 🔹 회원가입 신청 여부 확인 (registrations 테이블 조회)
    let pendingUser = await getPendingUserByEmail(email);
    if (pendingUser) {
      return res.redirect(`${process.env.FRONTEND_URL}/register`);
    }

    // 🔹 신규 유저 → 회원가입 페이지로 이동
    return res.redirect(`${process.env.FRONTEND_URL}/register`);
  } catch (error) {
    console.error("❌ Google OAuth 오류:", error.message);
    return res
      .status(500)
      .json({ error: "Google 로그인 실패", details: error.message });
  }
};

/**
 * ✅ 회원가입 API
 */
export const registerUser = async (req, res) => {
  console.log("📩 받은 데이터:", req.body);

  try {
    let { name, email, studentid, phone, year, status, role } = req.body;

    // 🔹 필수 입력값 검증
    if (!name || !email || !studentid || !phone || !year || !status || !role) {
      console.error("❌ 필수 입력값이 누락되었습니다:", {
        name,
        email,
        studentid,
        phone,
        year,
        status,
        role,
      });
      return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
    }

    // 🔹 role 값 정리 및 검증
    role = role.trim().normalize("NFC");

    console.log(
      "📌 받은 role 값:",
      `"${role}"`,
      "| 타입:",
      typeof role,
      "| 길이:",
      role.length
    );

    const validRoles = {
      학생: "학생",
      관리자: "관리자",
      교수: "교수",
      조교: "조교",
    };
    role = validRoles[role] || "학생"; // 유효하지 않으면 기본값 "학생" 적용

    console.log("🔍 백엔드에서 처리한 role 값:", role);

    // 🔹 특정 이메일이면 자동으로 `role = 'admin'`
    if (email === "gurdlf320@g.yju.ac.kr") {
      role = "관리자";
    }

    // 🔹 회원가입 데이터 확인 로그
    console.log("📌 회원가입 데이터 확인:", {
      name,
      email,
      studentid,
      phone,
      year,
      status,
      role,
    });

    // 🔹 기존 가입 여부 확인 (users 테이블 조회)
    if (await getUserByEmail(email)) {
      return res.status(400).json({ error: "이미 가입된 이메일입니다." });
    }

    // 🔹 기존 회원가입 신청 여부 확인 (registrations 테이블 조회)
    if (await getPendingUserByEmail(email)) {
      return res
        .status(400)
        .json({ error: "이미 회원가입 신청이 완료되었습니다." });
    }

    // ✅ 회원가입 요청 저장
    const insertId = await registerPendingUserService({
      name,
      email,
      studentid,
      phone,
      year,
      status,
      role,
    });
    // 🔹 특정 이메일(`gurdlf320@g.yju.ac.kr`)은 즉시 users 테이블로 이동 후 JWT 생성
    if (email === "gurdlf320@g.yju.ac.kr") {
      const accessToken = generateAccessToken({ email, role });
      const refreshToken = generateRefreshToken({ email });

      await updateUserRefreshToken(email, refreshToken);

      return res.status(201).json({
        message: "회원가입 및 자동 승인이 완료되었습니다.",
        token: accessToken,
        refreshToken,
      });
    }
    res.status(201).json({
      message:
        "회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.",
      user: insertId,
    });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

/**
 * ✅ Refresh Token을 이용한 JWT 갱신
 */
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken)
      return res.status(401).json({ error: "Refresh Token이 필요합니다." });

    const newAccessToken = generateAccessToken({
      email: req.user.email,
      role: req.user.role,
    });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("❌ Refresh Token 처리 오류:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

/**
 * ✅ 사용자 정보 조회 (JWT 인증 필수)
 */
export const getUser = (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: "사용자 정보를 불러오는 중 오류 발생" });
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
