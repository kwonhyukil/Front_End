import { google } from "googleapis";
import { pool } from "../config/db.js";
import { getGoogleCalendarTokens } from "../utils/googleOAuth.js";

/**
 * ✅ Google 캘린더 OAuth 로그인 요청
 */
export const googleCalendarAuth = (req, res) => {
  res.redirect(getGoogleCalendarAuthUrl());
};

/**
 * ✅ Google 캘린더 OAuth 콜백 처리
 */
export const googleCalendarCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code)
      return res.status(400).json({ error: "Authorization code missing" });

    const tokens = await getGoogleCalendarTokens(code);
    if (!tokens)
      return res.status(500).json({ error: "Google 캘린더 인증 실패" });

    const userId = req.user.id;

    // 🔹 Access Token을 사용자 세션에 저장 (DB에 저장하지 않고 바로 사용)
    req.session.googleAccessToken = tokens.accessToken;

    res.redirect("/events"); // 🔹 캘린더 페이지로 이동
  } catch (error) {
    console.error("❌ Google Calendar OAuth 오류:", error);
    res.status(500).json({ error: "Google Calendar OAuth Failed" });
  }
};

/**
 * ✅ Google 캘린더 일정 가져오기 (바로 프론트엔드에 표시)
 */
export const getGoogleCalendarEvents = async (req, res) => {
  try {
    const accessToken = req.session.googleAccessToken; // 세션에서 Access Token 가져오기
    if (!accessToken) {
      return res.status(401).json({ error: "Google 캘린더 액세스 권한 없음" });
    }

    const calendar = google.calendar({ version: "v3", auth: accessToken });

    const response = await calendar.events.list({
      calendarId: "primary", // 🔹 교수의 기본 캘린더 가져오기
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json({ events: response.data.items });
  } catch (error) {
    console.error("❌ Google Calendar 일정 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "Google Calendar 데이터를 가져올 수 없습니다." });
  }
};
