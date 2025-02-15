<script setup>
import { useDataStore, useInitStore } from '../store/data';
import { ref, nextTick } from "vue";

const store = useDataStore();
useInitStore(); // ✅ store 초기화

const text = ref("");
const editIndex = ref(null);
const editText = ref("");
const inputRef = ref(null);

// 📌 새로운 항목 추가 (입력 후 초기화 + 자동 포커스)
const addText = async () => {
  if (text.value.trim()) {
    store.addSubject(text.value);
    await nextTick();
    text.value = "";
    document.querySelector(".task-input")?.focus();
  }
};

// 📌 수정 모드 활성화 (자동 포커스 추가)
const startEditing = async (index) => {
  editIndex.value = index;
  editText.value = store.subjects[index].text;

  await nextTick();
  inputRef.value?.focus();
};

// 📌 수정 완료 후 저장
const saveEdit = (index) => {
  if (editText.value.trim()) {
    store.editSubject(index, editText.value);
    editIndex.value = null; // ✅ 수정 모드 종료
  }
};

// 📌 삭제 기능
const deleteItem = (index) => {
  store.removeSubject(index);
};

// 📌 **체크박스 상태 변경 (✅ 반응형 문제 해결 + LocalStorage 동기화)**
const toggleCheck = (index) => {
  store.toggleCheck(index);
};
</script>

<template>
  <div class="container">
    <h1>📝 My To-Do List</h1>

    <h3 class="task-count">📌 등록된 할 일 개수: <span>{{ store.count }}</span></h3>

    <h3 v-if="store.subjects.length === 0" class="no-tasks">⚠️ 등록된 값이 없습니다.</h3>

    <div v-else class="task-list">
      <div 
        v-for="(subject, index) in store.subjects" 
        :key="index" 
        class="task-item" 
        :class="{ completed: subject.checked }"
      >
<!-- ✅ 체크박스를 `v-model` 대신 `:checked`로 변경 (반응형 문제 해결) -->
<input type="checkbox" :checked="subject.checked" @change="toggleCheck(index)">

        <span v-if="editIndex === index">
          <input type="text" v-model="editText" ref="inputRef" class="edit-input">
          <button @click="saveEdit(index)" class="save-btn">저장</button>
          <button @click="editIndex = null" class="cancel-btn">취소</button>
        </span>

        <span v-else>
          {{ subject.text }}
          <button @click="startEditing(index)" class="edit-btn">✏️</button>
          <button @click="deleteItem(index)" class="delete-btn">❌</button>
        </span>
      </div>
    </div>

    <!-- ✅ 입력칸 유지 -->
    <div class="input-container">
      <input type="text" v-model="text" placeholder="할 일을 입력하세요" class="task-input">
      <button @click="addText" class="add-btn">➕ 등록</button>
    </div>
  </div>
</template>

<style>
/* ✅ 기존 스타일 유지 */

/* ✅ 전체 레이아웃 */
.container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}

/* ✅ 제목 스타일 */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

/* ✅ 할 일 개수 스타일 */
.task-count {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
}

.task-count span {
  font-weight: bold;
  color: #007bff;
}

/* ✅ 등록된 값이 없을 때 */
.no-tasks {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 10px;
}

/* ✅ 할 일 리스트 */
.task-list {
  margin-top: 15px;
}

/* ✅ 개별 할 일 항목 */
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: 0.3s;
}

/* ✅ 체크된 항목 스타일 (빗금 효과 추가) */
.completed {
  text-decoration: line-through;
  color: #999;
  position: relative;
}

/* ✅ ✅ ✅ 빗금 효과 추가 (변경된 부분) */
.completed::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: red;
  transform: rotate(-10deg);
  opacity: 0.7;
}

/* ✅ 입력 폼 */
.input-container {
  display: flex;
  margin-top: 15px;
}

.task-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.add-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 8px;
  border-radius: 5px;
  cursor: pointer;
}

.add-btn:hover {
  background: #218838;
}

/* ✅ 수정 입력창 */
.edit-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

/* ✅ 버튼 스타일 */
.edit-btn, .delete-btn, .save-btn, .cancel-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
}

/* 수정 버튼 */
.edit-btn {
  color: #ffc107;
}

.edit-btn:hover {
  color: #d39e00;
}

/* 삭제 버튼 */
.delete-btn {
  color: #dc3545;
}

.delete-btn:hover {
  color: #bd2130;
}

/* 저장 버튼 */
.save-btn {
  color: #007bff;
}

.save-btn:hover {
  color: #0056b3;
}

/* 취소 버튼 */
.cancel-btn {
  color: #6c757d;
}

.cancel-btn:hover {
  color: #5a6268;
}
</style>
✅ 🚀 홈.vue 스타일 코드 (기존 코드 유지 + 빗금 추가)
vue
복사
편집
<style>
/* ✅ 기존 스타일 유지 */

/* ✅ 전체 레이아웃 */
.container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}

/* ✅ 제목 스타일 */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

/* ✅ 상태 카드 (할 일 개수) */
.status-card {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 18px;
}

.count {
  font-weight: bold;
  color: #007bff;
}

/* ✅ 체크리스트 스타일 */
.task-list {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}

/* ✅ 리스트 스타일 */
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

li {
  padding: 10px;
  font-size: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

/* ✅ 체크된 항목 스타일 */
.completed {
  text-decoration: line-through;
  color: #999;
  font-style: italic;
  background: #e9ecef;
}

/* ✅ ✅ ✅ 빗금 효과 추가 (변경된 부분) */
.completed::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: red;
  transform: rotate(0deg);
  opacity: 0.7;
}
</style>