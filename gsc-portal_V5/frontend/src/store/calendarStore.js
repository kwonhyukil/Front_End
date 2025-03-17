// [경로: frontend/src/store/calendarStore.js]
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchCalendarEvents,
  createCalendarEventRequest,
  updateCalendarEventRequest,
  deleteCalendarEventRequest,
} from "../api/calendar.js";

export const useCalendarStore = defineStore("calendar", () => {
  const events = ref([]);

  const loadEvents = async (token) => {
    try {
      events.value = await fetchCalendarEvents(token);
    } catch (err) {
      console.error("loadEvents error:", err);
    }
  };

  const addEvent = async (token, payload) => {
    return await createCalendarEventRequest(token, payload);
  };
  const editEvent = async (token, id, payload) => {
    return await updateCalendarEventRequest(token, id, payload);
  };
  const removeEvent = async (token, id) => {
    return await deleteCalendarEventRequest(token, id);
  };

  return {
    events,
    loadEvents,
    addEvent,
    editEvent,
    removeEvent,
  };
});
