<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content schedule-modal">
      <h3>시간표 등록</h3>
      <label>요일</label>
      <select v-model="dayOfWeek">
        <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
      </select>

      <label>시작 시간</label>
      <input type="time" v-model="startTime" />
      <label>종료 시간</label>
      <input type="time" v-model="endTime" />

      <label>과목명</label>
      <input v-model="courseName" />
      <label>교수명</label>
      <input v-model="professorName" />
      <label>강의실</label>
      <input v-model="room" />

      <label>학년</label>
      <select v-model="gradeId">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <label>
        <input type="checkbox" v-model="repeatWeekly" />
        매주 반복
      </label>

      <div class="button-group">
        <button @click="submitForm">등록</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { useScheduleStore } from "../../store/scheduleStore.js";

export default {
  name: "ScheduleModal",
  props: ["day","hour"],
  emits: ["close","created"],
  setup(props,{emit}) {
    const days=["월","화","수","목","금","토"];
    const dayOfWeek= ref(props.day);
    const startTime= ref("");
    const endTime= ref("");
    const courseName= ref("");
    const professorName= ref("");
    const room= ref("");
    const gradeId= ref("1");
    const repeatWeekly= ref(false);

    const authStore= useAuthStore();
    const scheduleStore= useScheduleStore();

    onMounted(()=>{
      // 기본값 설정
      if(props.hour) {
        // 예: 9 -> "09:00"
        const hh= props.hour<10 ? `0${props.hour}` : `${props.hour}`;
        startTime.value=`${hh}:00`;
        endTime.value=`${hh}:50`;
      }
    });

    const submitForm= async () => {
      try {
        if(!courseName.value) {
          alert("과목명을 입력하세요");
          return;
        }
        const payload={
          course_name: courseName.value,
          professor_name: professorName.value || "교수미지정",
          room: room.value || "강의실미지정",
          day_of_week: dayOfWeek.value,
          start_time: startTime.value,
          end_time: endTime.value,
          grade_id: Number(gradeId.value),
          repeat_weekly: repeatWeekly.value,
        };
        await scheduleStore.addSchedule(authStore.token,payload);
        alert("시간표 등록 완료");
        emit("created");
      } catch (err) {
        alert("등록 오류:"+ err.response?.data?.error);
      }
    };
    const closeModal=() => {
      emit("close");
    };

    return {
      days, dayOfWeek, startTime, endTime,
      courseName, professorName, room, gradeId, repeatWeekly,
      submitForm, closeModal
    };
  }
};
</script>

<style scoped>
.schedule-modal label {
  display: block;
  margin-top: 8px;
  font-weight: bold;
}
.schedule-modal input,
.schedule-modal select {
  width: 100%;
  margin-bottom: 6px;
  padding: 6px;
}
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
