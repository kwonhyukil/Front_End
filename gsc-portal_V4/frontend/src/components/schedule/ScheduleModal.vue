<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>시간표 등록 모달</h3>

      <!-- 학년 선택 -->
      <label>학년</label>
      <select v-model="gradeYear">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <!-- 요일 선택 -->
      <label>요일</label>
      <select v-model="dayOfWeek">
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
        <option value="토">토</option>
      </select>

      <!-- 과목명 입력 -->
      <label>과목명</label>
      <input v-model="subjectName" type="text" placeholder="예) 알고리즘" />

      <!-- 교수명 입력 -->
      <label>교수명</label>
      <input v-model="professorName" type="text" placeholder="예) 홍길동" />

      <!-- 강의실 입력 -->
      <label>강의실</label>
      <input v-model="classroom" type="text" placeholder="예) A101" />

      <!-- 시작 시간 입력 -->
      <label>시작 시간</label>
      <input v-model="startTime" type="time" />

      <!-- 종료 시간 입력 -->
      <label>종료 시간</label>
      <input v-model="endTime" type="time" />

      <!-- 등록/취소 버튼 -->
      <div class="button-group">
        <button @click="submitForm">등록하기</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { useScheduleStore } from "../../store/scheduleStore.js";

/**
 * 시간표 등록 모달 컴포넌트
 * - 부모 컴포넌트에서 `selectedDay`, `selectedHour` 값을 props로 전달받음
 * - 빈 칸 클릭 시 해당 요일과 시간을 자동 설정
 */
export default {
  name: "ScheduleModal",
  props: {
    selectedDay: { type: String, default: "월" }, // 기본값: 월요일
    selectedHour: { type: Number, default: 9 }, // 기본값: 오전 9시
  },
  emits: ["close", "created"], // 부모 컴포넌트에서 모달 닫기와 등록 완료 이벤트를 받음
  setup(props, { emit }) {
    const authStore = useAuthStore(); // 사용자 인증 정보 관리
    const scheduleStore = useScheduleStore(); // 시간표 관련 상태 관리

    // 입력값을 저장할 ref 변수 선언
    const gradeYear = ref("1"); // 학년
    const dayOfWeek = ref(props.selectedDay); // 요일
    const subjectName = ref(""); // 과목명
    const professorName = ref(""); // 교수명
    const classroom = ref(""); // 강의실
    const startTime = ref(""); // 시작 시간
    const endTime = ref(""); // 종료 시간

    /**
     * 모달이 열릴 때, 선택한 시간에 맞춰 시작/종료 시간 기본값 설정
     */
    onMounted(() => {
      const hourStr = props.selectedHour < 10 ? `0${props.selectedHour}` : `${props.selectedHour}`;
      startTime.value = `${hourStr}:00`;
      endTime.value = `${hourStr}:50`;
    });

    /**
     * 시간표 등록 API 요청
     * - 필수값(과목명) 검증 후 `useScheduleStore`의 `addSchedule()` 호출
     * - 성공 시 `emit("created")`을 호출하여 부모 컴포넌트에서 새 시간표 불러오기
     */
    const submitForm = async () => {
      try {
        if (!subjectName.value) {
          alert("과목명을 입력하세요.");
          return;
        }

        // 시간표 데이터 생성
        const payload = {
          subject_name: subjectName.value,
          professor_name: professorName.value || "교수 미지정",
          classroom: classroom.value || "강의실 미지정",
          day_of_week: dayOfWeek.value,
          start_time: startTime.value,
          end_time: endTime.value,
          grade_year: parseInt(gradeYear.value),
        };

        // 시간표 등록 API 호출
        await scheduleStore.addSchedule(authStore.token, payload);
        alert("시간표 등록 완료!");

        emit("created"); // 부모 컴포넌트에서 새 시간표를 불러오도록 트리거
      } catch (error) {
        alert("등록 오류: " + error.response?.data?.error);
      }
    };

    /**
     * 모달 닫기
     * - 부모 컴포넌트에서 `showModal = false`로 변경하여 모달 숨김
     */
    const closeModal = () => {
      emit("close");
    };

    return {
      gradeYear,
      dayOfWeek,
      subjectName,
      professorName,
      classroom,
      startTime,
      endTime,
      submitForm,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* 모달 배경 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 모달 컨텐츠 박스 */
.modal-content {
  background: #fff;
  width: 350px;
  padding: 20px;
  border-radius: 8px;
}

/* 버튼 그룹 (등록, 취소 버튼) */
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
