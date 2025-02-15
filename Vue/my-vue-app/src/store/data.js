import { defineStore } from "pinia";
import { onMounted } from "vue";

export const useDataStore = defineStore("data", {
  state: () => ({
    subjects: JSON.parse(localStorage.getItem("subjects")) || [], // ✅ 항상 배열 유지
  }),

  getters: {
    // 🔥 ✅ "완료되지 않은" 항목 개수만 카운트
    count: (state) => state.subjects.filter((subject) => !subject.checked).length,
  },

  actions: {
    // ✅ LocalStorage 업데이트 함수
    saveToLocalStorage() {
      localStorage.setItem("subjects", JSON.stringify(this.subjects));
    },

    // ✅ LocalStorage에서 초기 데이터 로드 (예외 처리 포함)
    loadFromLocalStorage() {
      try {
        const savedData = localStorage.getItem("subjects");
        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // 🔥 subjects가 배열인지 확인하고 아니면 초기화
          if (Array.isArray(parsedData)) {
            this.subjects = parsedData;
          } else {
            console.warn("⚠️ subjects 데이터가 배열이 아님. 초기화합니다.");
            this.subjects = [];
            this.saveToLocalStorage();
          }
        }
      } catch (error) {
        console.error("❌ JSON 파싱 오류! LocalStorage를 초기화합니다.");
        this.subjects = [];
        this.saveToLocalStorage();
      }
    },

    // 📌 할 일 추가 (✅ 반응형 문제 해결 및 최적화)
    addSubject(text) {
      this.subjects = [...this.subjects, { text, checked: false }]; // ✅ 새로운 배열 할당
      this.saveToLocalStorage();
    },

    // 📌 **체크박스 상태 변경 (✅ 반응형 문제 완벽 해결)**
    toggleCheck(index) {
      this.subjects = this.subjects.map((subject, i) =>
        i === index ? { ...subject, checked: !subject.checked } : subject
      );
      this.saveToLocalStorage();
    },

    // 📌 항목 수정 기능 (✅ 반응형 문제 해결)
    editSubject(index, newText) {
      if (newText.trim()) {
        this.subjects = this.subjects.map((subject, i) =>
          i === index ? { ...subject, text: newText } : subject
        );
        this.saveToLocalStorage();
      }
    },

    // 📌 항목 삭제 기능 (✅ 반응형 문제 해결)
    removeSubject(index) {
      this.subjects = this.subjects.filter((_, i) => i !== index);
      this.saveToLocalStorage();
    },
  },
});

// ✅ store가 생성될 때 LocalStorage에서 데이터 로드
export function useInitStore() {
  const store = useDataStore();
  onMounted(() => {
    store.loadFromLocalStorage();
  });
}
