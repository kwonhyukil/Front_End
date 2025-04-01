// 📁 src/store/timetableStore.js
import { defineStore } from "pinia";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const useTimetableStore = defineStore("timetable", {
  state: () => ({
    timetables: [],
  }),
  actions: {
    async loadAllTimetables(grade = "all", weekStart, weekEnd) {
      try {
        const res = await axios.get(`${baseURL}/timetables`, {
          params: { grade, week_start: weekStart, week_end: weekEnd },
        });
        this.timetables = res.data;
      } catch (err) {
        console.error("시간표 불러오기 실패", err);
      }
    },

    async createTimetable(token, payload, grade = "1", weekStart, weekEnd) {
      await axios.post(`${baseURL}/timetables`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await this.loadAllTimetables(grade, weekStart, weekEnd);
    },
  },
});
