import axios from "axios";

export const fetchCalendarEvents = () => {
  return axios.get("http://localhost:8080/calendar/google/callback");
};
