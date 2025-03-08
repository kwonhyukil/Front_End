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

    const { name, email } = userInfo;

    // 이메일 도메인 검증
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ error: "Invalid email domain" });
    }

    // 기존 사용자 확인
    let user = await getUserByEmail(email);
    if (user) {
      await updateLastLogin(email);

      // ✅ JWT 발급
      const { accessToken, refreshToken } = generateTokens(user);
      await updateUserRefreshToken(email, refreshToken); // Refresh Token 저장

      console.log("✅ JWT 발급 완료:", accessToken);
      console.log("✅ Refresh Token 저장 완료:", refreshToken);

      // ✅ 로그인 완료 후 프론트엔드로 리다이렉트 (JWT 포함)
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    }

    // 회원가입 신청 여부 확인
    let pendingUser = await getPendingUserByEmail(email);
    if (pendingUser) {
      console.log("📌 회원가입 신청된 사용자. 회원가입 승인 필요.");
      return res.status(400).json({ error: "Pending registration" });
    }

    // 신규 유저 → 회원가입 페이지로 이동
    console.log("📌 신규 사용자. 회원가입 페이지로 이동.");
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

    // 🔹 특정 이메일이면 자동으로 `role = '관리자'`
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

    // 🔹 기존 사용자 확인 (users 테이블 조회)
    if (await getUserByEmail(email)) {
      return res.status(400).json({ error: "이미 가입된 사용자입니다." });
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
      const { success, token, refreshToken } = await approveUserRegistration(
        email
      );
      if (success) {
        await updateUserRefreshToken(email, refreshToken); // 🔹 Refresh Token 저장
        return res.status(201).json({
          message: "회원가입 및 자동 승인이 완료되었습니다.",
          token,
          refreshToken,
        });
      }
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
 * ✅ 사용자 정보 조회 (JWT 인증 필수)
 */
export const getUser = async (req, res) => {
  try {
    const email = req.user.email; // 🔹 JWT에서 사용자 이메일 추출
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
 * ✅ JWT 갱신 API (Refresh Token 이용)
 */
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh Token이 필요합니다." });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ error: "Refresh Token이 유효하지 않습니다." });
        }

        const user = await getUserByEmail(decoded.email);
        if (!user) {
          return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        const { accessToken, refreshToken: newRefreshToken } =
          generateTokens(user);
        await updateUserRefreshToken(user.email, newRefreshToken); // 🔹 새로운 Refresh Token 저장

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
      }
    );
  } catch (error) {
    console.error("❌ Refresh Token 처리 오류:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
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
