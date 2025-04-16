import axios from "axios";

export const fetchGoogleCalendarEvents = async () => {
  const token = localStorage.getItem("google_access_token");
  return axios.get("http://localhost:8080/api/calendar/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const createGoogleCalendarEvent = (eventData, accessToken) => {
  return axios.post("http://localhost:8080/calendar/events", eventData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
