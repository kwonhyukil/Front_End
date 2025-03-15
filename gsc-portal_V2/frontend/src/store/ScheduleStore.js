// 📂 frontend/src/store/ScheduleStore.js
import { ref, onMounted } from "vue";
import { fetchSchedule, addSchedule, deleteSchedule } from "../api/calendarApi";
import { io } from "socket.io-client/dist/socket.io.js";

export const useScheduleStore = () => {
  const schedule = ref([]);
  const socket = io(import.meta.env.VITE_BACKEND_URL);

  const loadSchedule = async () => {
    try {
      const data = await fetchSchedule();
      schedule.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("시간표 불러오기 실패:", error);
    }
  };

  onMounted(() => {
    loadSchedule();
    socket.on("scheduleUpdated", (newSchedule) => {
      console.log("📡 실시간 시간표 업데이트 수신:", newSchedule);
      schedule.value = Array.isArray(newSchedule) ? newSchedule : [];
    });
  });

  return { schedule, loadSchedule, addSchedule, deleteSchedule };
};
