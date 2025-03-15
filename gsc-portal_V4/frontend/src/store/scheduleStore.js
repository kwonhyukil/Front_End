// [경로: frontend/src/store/scheduleStore.js]
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchSchedules,
  createScheduleRequest,
  updateScheduleRequest,
  deleteScheduleRequest,
} from "../api/schedule.js";

export const useScheduleStore = defineStore("schedule", () => {
  const schedules = ref([]);

  // 시간표 로드
  const loadSchedules = async (grade = "all") => {
    try {
      schedules.value = await fetchSchedules(grade);
    } catch (error) {
      console.error("loadSchedules error:", error);
    }
  };

  // 등록/수정/삭제
  const addSchedule = async (token, payload) => {
    return await createScheduleRequest(token, payload);
  };
  const editSchedule = async (token, id, payload) => {
    return await updateScheduleRequest(token, id, payload);
  };
  const removeSchedule = async (token, id) => {
    return await deleteScheduleRequest(token, id);
  };

  return {
    schedules,
    loadSchedules,
    addSchedule,
    editSchedule,
    removeSchedule,
  };
});
