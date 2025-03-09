import { google } from "googleapis";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ✅ Google 로그인 OAuth2 클라이언트
export const googleLoginOAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_LOGIN_REDIRECT_URI // 로그인 전용 리다이렉트 URI
);

// ✅ Google 캘린더 OAuth2 클라이언트 (학과 일정 연동 전용)
export const googleCalendarOAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI // 캘린더 연동 전용 리다이렉트 URI
);

/**
 * ✅ Google 로그인 OAuth URL 생성
 * - Google 로그인 전용 OAuth URL 반환
 */
export const getGoogleLoginAuthUrl = () => {
  return googleLoginOAuth.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "profile", "email"],
    prompt: "consent",
  });
};

/**
 * ✅ Google 캘린더 OAuth URL 생성
 * - 학과 일정 페이지(`/events`)에서만 사용
 */
export const getGoogleCalendarAuthUrl = () => {
  return googleCalendarOAuth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });
};

/**
 * ✅ Google 로그인 후 사용자 정보 가져오기
 * @param {string} code - Google에서 반환된 Authorization Code
 * @returns {object|null} - 사용자 정보 반환 (실패 시 null)
 */
export const getGoogleUser = async (code) => {
  try {
    const { tokens } = await googleLoginOAuth.getToken(code);
    googleLoginOAuth.setCredentials(tokens);

    const { data: userInfo } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    return userInfo;
  } catch (error) {
    console.error("❌ Google API 요청 오류:", error);
    return null;
  }
};

/**
 * ✅ Google 캘린더 Access Token 가져오기
 * @param {string} code - Google에서 반환된 Authorization Code
 * @returns {object|null} - Access Token 및 Refresh Token 반환
 */
export const getGoogleCalendarTokens = async (code) => {
  try {
    const { tokens } = await googleCalendarOAuth.getToken(code);
    googleCalendarOAuth.setCredentials(tokens);

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  } catch (error) {
    console.error("❌ Google 캘린더 OAuth 오류:", error);
    return null;
  }
};
