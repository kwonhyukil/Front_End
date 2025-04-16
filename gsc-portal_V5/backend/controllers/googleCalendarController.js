// controllers/googleCalendarController.js
import { google } from "googleapis";

export const getCalendarEvents = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not provided" });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  try {
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
    console.error("Google Calendar API Error:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
