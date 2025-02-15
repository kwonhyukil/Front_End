import { defineStore } from "pinia";
import { onMounted } from "vue";

export const useDataStore = defineStore("data", {
  state: () => ({
    count: 0,
    subjects: [], // 초기 빈 배열
  }),
  actions: {
    // ✅ localStorage 업데이트 함수
    saveToLocalStorage() {
      localStorage.setItem("subjects", JSON.stringify(this.subjects));
    },

    // ✅ 초기 데이터 로드 (새로고침 시 데이터 유지)
    loadFromLocalStorage() {
      const savedData = localStorage.getItem("subjects");
      if (savedData) {
        this.subjects = JSON.parse(savedData);
      }
    },

    increment() {
      this.count++;
      this.saveToLocalStorage();
    },
    decrement() {
      this.count--;
      this.saveToLocalStorage();
    },

    // 📌 할 일 추가
    addSubject(text) {
      this.subjects.push({ text, checked: false });
      this.increment();
      this.saveToLocalStorage();
    },

    // 📌 체크박스 상태 변경 (반응형 문제 해결)
    toggleCheck(index) {
      this.subjects[index] = {
        ...this.subjects[index], // ✅ 기존 데이터 복사
        checked: !this.subjects[index].checked, // ✅ 체크 상태 변경
      };
      this.saveToLocalStorage();
    },

    // 📌 항목 수정 기능
    editSubject(index, newText) {
      if (newText.trim()) {
        this.subjects[index].text = newText;
        this.saveToLocalStorage();
      }
    },

    // 📌 항목 삭제 기능
    removeSubject(index) {
      this.subjects.splice(index, 1);
      this.decrement();
      this.saveToLocalStorage();
    },
  },
});

// ✅ store가 생성될 때 `localStorage`에서 데이터 로드
export function useInitStore() {
  const store = useDataStore();
  onMounted(() => {
    store.loadFromLocalStorage();
  });
}
