import axios from "axios";

const API_KEY = "YOUR_GOOGLE_API_KEY";
const CALENDAR_ID = "YOUR_CALENDAR_ID";
const URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

export const fetchCalendarEvents = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.items || [];
  } catch (error) {
    console.error("Google Calendar API 오류:", error);
    return [];
  }
};
