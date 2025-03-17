// 📄 timetableStore.js
/*
  Pinia 스토어: 시간표 정보 저장
*/
import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchAllTimetables } from "../api/timetable.js";

/**
 * 시간표 정보를 전역에서 관리
 */
export const useTimetableStore = defineStore("timetable", () => {
  const timetables = ref([]);

  // 전체 시간표 로드
  const loadAllTimetables = async () => {
    try {
      timetables.value = await fetchAllTimetables();
    } catch (error) {
      console.error("시간표 로드 실패:", error);
    }
  };

  return {
    timetables,
    loadAllTimetables,
  };
});
