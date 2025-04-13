<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content schedule-modal">
      <h3>{{ isEditMode ? '수업 수정' : '시간표 등록' }}</h3>

      <label>요일</label>
      <select v-model="dayOfWeek">
        <option v-for="d in days" :key="d">{{ d }}</option>
      </select>

      <label>시작 시간</label>
      <input type="time" v-model="startTime" />

      <label>종료 시간</label>
      <input type="time" v-model="endTime" />

      <label>과목명</label>
      <input v-model="courseName" />

      <label>교수명</label>
      <select v-model="professorId">
        <option disabled value="">교수 선택</option>
        <option v-for="prof in professors" :key="prof.id" :value="prof.id">
          {{ prof.name }}
        </option>
      </select>

      <label>강의실</label>
      <input v-model="room" />

      <label>유형</label>
      <select v-model="scheduleType">
        <option value="일반">일반</option>
        <option value="휴강">휴강</option>
        <option value="보강">보강</option>
        <option value="특강">특강</option>
      </select>

      <label>날짜 (선택 시 해당 날짜만 적용)</label>
      <input type="date" v-model="customDate" />

      <label>색상</label>
      <input type="color" v-model="colorCode" />

      <div class="button-group">
        <button @click="submitForm">{{ isEditMode ? '수정' : '등록' }}</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../store/authStore.js';
import { useTimetableStore } from '../../store/timetableStore.js';
import { fetchProfessors } from '../../api/user.js';

const props = defineProps(['day', 'hour', 'grade', 'scheduleToEdit']);
const emit = defineEmits(['close', 'created']);

const days = ['월','화','수','목','금','토'];
const courseName = ref('');
const professorId = ref('');
const room = ref('');
const dayOfWeek = ref('');
const startTime = ref('');
const endTime = ref('');
const colorCode = ref('#cfe9ff');
const gradeId = ref('1');
const customDate = ref('');
const scheduleType = ref('일반');

const store = useTimetableStore();
const auth = useAuthStore();
const professors = ref([]);

const isEditMode = computed(() => !!props.scheduleToEdit);

onMounted(async () => {
  if (props.day) dayOfWeek.value = props.day;
  if (props.hour) {
    const hh = String(props.hour).padStart(2, '0');
    startTime.value = `${hh}:00`;
    endTime.value = `${String(props.hour + 1).padStart(2, '0')}:00`;
  }
  if (props.grade) gradeId.value = String(props.grade);

  if (props.scheduleToEdit) {
    const s = props.scheduleToEdit;
    courseName.value = s.course_name;
    professorId.value = s.professor_id;
    room.value = s.room;
    dayOfWeek.value = s.day_of_week;
    startTime.value = s.start_time;
    endTime.value = s.end_time;
    gradeId.value = String(s.grade_id);
    customDate.value = s.custom_date?.split('T')[0] || '';
    colorCode.value = s.color_code || '#cfe9ff';
    scheduleType.value = s.schedule_type || '일반';
  }

  try {
    professors.value = await fetchProfessors();
  } catch (err) {
    console.error('교수 목록 로딩 실패 ❌', err);
    alert('교수 목록 불러오기 실패');
  }
});

const getProfessorNameById = (id) => {
  const found = professors.value.find(p => p.id === Number(id));
  return found?.name || '';
};

const submitForm = async () => {
  try {
    if (!courseName.value || !professorId.value || !room.value) {
      alert('필수 항목을 모두 입력하세요.');
      return;
    }

    const payload = {
      course_name: courseName.value,
      professor_id: Number(professorId.value),
      professor_name: getProfessorNameById(professorId.value),
      day_of_week: dayOfWeek.value,
      start_time: startTime.value,
      end_time: endTime.value,
      room: room.value,
      grade_id: Number(gradeId.value),
      custom_date: customDate.value || null,
      color_code: colorCode.value,
      schedule_type: scheduleType.value,
    };

    if (isEditMode.value) {
      await store.updateTimetable(auth.token, props.scheduleToEdit.id, payload, gradeId.value);
    } else {
      await store.createTimetable(auth.token, payload, gradeId.value);
    }

    emit('created');
  } catch (e) {
    console.error('❌ 저장 실패', e);
    alert('저장 실패: ' + (e.response?.data?.error || e.message));
  }
};

const closeModal = () => emit('close');
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
