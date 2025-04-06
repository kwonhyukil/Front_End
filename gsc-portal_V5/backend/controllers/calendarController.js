import { google } from "googleapis";

// 캘린더 이벤트 조회
export const getCalendarEvents = async (req, res) => {
  try {
    // 🧠 이건 지금 임시로 메모리에 저장된 토큰에서 access_token 가져온다고 가정
    const user = req.user; // JWT에서 추출된 유저 정보
    const { accessToken } = req.googleAuthTokens[user.email] || {};

    if (!accessToken) {
      return res.status(401).json({ error: "Google access token 없음" });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const result = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(result.data.items);
  } catch (err) {
    console.error("캘린더 이벤트 불러오기 오류:", err);
    res.status(500).json({ error: "캘린더 API 실패" });
  }
};

// 캘린더 이벤트 생성
export const createCalendarEvent = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken } = req.googleAuthTokens[user.email] || {};

    if (!accessToken) {
      return res.status(401).json({ error: "Google access token 없음" });
    }

    const { summary, description, start, end } = req.body;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: "Asia/Seoul",
      },
      end: {
        dateTime: end,
        timeZone: "Asia/Seoul",
      },
    };

    const result = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.json(result.data);
  } catch (err) {
    console.error("캘린더 이벤트 생성 오류:", err);
    res.status(500).json({ error: "캘린더 이벤트 생성 실패" });
  }
};

// 캘린더 이벤트 수정
export const updateCalendarEvent = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken } = req.googleAuthTokens[user.email] || {};

    if (!accessToken) {
      return res.status(401).json({ error: "Google access token 없음" });
    }

    const { eventId } = req.params;
    const { summary, description, start, end } = req.body;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: "Asia/Seoul",
      },
      end: {
        dateTime: end,
        timeZone: "Asia/Seoul",
      },
    };

    const result = await calendar.events.update({
      calendarId: "primary",
      eventId: eventId,
      resource: event,
    });

    res.json(result.data);
  } catch (err) {
    console.error("캘린더 이벤트 수정 오류:", err);
    res.status(500).json({ error: "캘린더 이벤트 수정 실패" });
  }
};

// 캘린더 이벤트 삭제
export const deleteCalendarEvent = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken } = req.googleAuthTokens[user.email] || {};

    if (!accessToken) {
      return res.status(401).json({ error: "Google access token 없음" });
    }

    const { eventId } = req.params;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });

    res.json({ message: "이벤트 삭제 완료" });
  } catch (err) {
    console.error("캘린더 이벤트 삭제 오류:", err);
    res.status(500).json({ error: "캘린더 이벤트 삭제 실패" });
  }
};
