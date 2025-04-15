// 📁 src/store/timetableStore.js
import { defineStore } from "pinia";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const useTimetableStore = defineStore("timetable", {
  state: () => ({
    timetables: [],
  }),
  actions: {
    // ✅ 전체 시간표 불러오기 (학년 + 주차 범위)
    async loadAllTimetables(grade = "all", weekStart, weekEnd) {
      try {
        const res = await axios.get(`${baseURL}/api/timetables`, {
          params: {
            grade,
            week_start: weekStart,
            week_end: weekEnd,
          },
        });
        this.timetables = res.data;
      } catch (err) {
        console.error("시간표 불러오기 실패 ❌", err);
      }
    },

    // ✅ 시간표 등록 후 최신 목록 불러오기
    async createTimetable(token, payload, grade = "1", weekStart, weekEnd) {
      try {
        await axios.post(`${baseURL}/timetables`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.loadAllTimetables(grade, weekStart, weekEnd);
      } catch (err) {
        console.error("시간표 등록 실패 ❌", err);
        throw err;
      }
    },

    // ✅ 시간표 수정
    async updateTimetable(token, id, payload, grade = "1", weekStart, weekEnd) {
      try {
        await axios.put(`${baseURL}/timetables/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.loadAllTimetables(grade, weekStart, weekEnd);
      } catch (err) {
        console.error("시간표 수정 실패 ❌", err);
        throw err;
      }
    },

    // ✅ 시간표 삭제
    async deleteTimetable(token, id, grade = "1", weekStart, weekEnd) {
      try {
        await axios.delete(`${baseURL}/timetables/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.loadAllTimetables(grade, weekStart, weekEnd);
      } catch (err) {
        console.error("시간표 삭제 실패 ❌", err);
        throw err;
      }
    },
  },
});
