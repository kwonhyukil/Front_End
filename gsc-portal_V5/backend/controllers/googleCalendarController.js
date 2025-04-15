import { google } from "googleapis";
import oauth2Client from "../config/google0AuthClient.js";

const getCalendarEvents = async (req, res) => {
  try {
    const userId = req.user.id; // 로그인된 사용자 ID (JWT 등으로부터)
    const user = await User.findById(userId);

    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: "Google access token not found" });
    }

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken, // optional: 자동 갱신
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json({ events: data.items });
  } catch (err) {
    console.error("Google Calendar Error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
export default {
  getCalendarEvents,
};
