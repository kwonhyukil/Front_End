<template>
    <div class="calendar-page container">
      <h2>학과 행사</h2>
      <div class="calendar-layout">
        <!-- 왼쪽: 이벤트 목록 -->
        <div class="event-list">
          <h3>{{ currentMonth }} 월 이벤트</h3>
          <ul>
            <li v-for="ev in monthlyEvents" :key="ev.id" @click="openEditModal(ev)">
              <span class="date-label">{{ formatDate(ev.event_date) }}</span>
              {{ ev.title }}
            </li>
          </ul>
          <button v-if="isAdminOrProfessor" @click="openNewModal">행사 추가</button>
        </div>
  
        <!-- 오른쪽: 달력 -->
        <div class="mini-calendar">
          <div class="calendar-header">
            <button @click="prevMonth">&lt;</button>
            <span>{{ displayYear }}년 {{ displayMonth+1 }}월</span>
            <button @click="nextMonth">&gt;</button>
          </div>
          <table>
            <thead>
              <tr>
                <th v-for="(wday, idx) in weekDays" :key="idx">{{ wday }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wIndex) in calendarRows" :key="wIndex">
                <td
                  v-for="(dayItem, dIndex) in week"
                  :key="dIndex"
                  :class="{'other-month': dayItem.otherMonth, 'today': isToday(dayItem.date)}"
                  @click="dayClick(dayItem.date)"
                >
                  {{ dayItem.day }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 모달 -->
      <div v-if="showModal && isAdminOrProfessor" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h3>{{ editEvent ? '행사 수정' : '행사 추가' }}</h3>
          <label>제목</label>
          <input v-model="title" />
          <label>설명</label>
          <textarea v-model="description"></textarea>
          <label>날짜</label>
          <input type="date" v-model="eventDate" />
          <div class="button-group">
            <button @click="submitEvent">{{ editEvent ? '수정' : '등록' }}</button>
            <button @click="closeModal">취소</button>
          </div>
          <div v-if="editEvent" class="delete-btn">
            <button @click="deleteEvent">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useAuthStore } from "../../store/authStore.js";
  import { useCalendarStore } from "../../store/calendarStore.js";
  
  export default {
    name: "CalendarPage",
    setup() {
      const authStore = useAuthStore();
      const calendarStore = useCalendarStore();
      const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);
  
      const showModal = ref(false);
      const editEvent = ref(null);
      const title = ref("");
      const description = ref("");
      const eventDate = ref("");
  
      const currentMonth = ref(new Date().getMonth()+1);
      const monthlyEvents = computed(()=> {
        // 필터: 현재 월에 해당하는 이벤트
        return calendarStore.events.filter(ev => {
          const evMonth= new Date(ev.event_date).getMonth()+1;
          return evMonth=== currentMonth.value;
        });
      });
  
      // 달력 표시용
      const displayYear = ref(new Date().getFullYear());
      const displayMonth = ref(new Date().getMonth());
      const weekDays = ["일","월","화","수","목","금","토"];
  
      onMounted(()=> {
        loadData();
        buildCalendar(displayYear.value, displayMonth.value);
      });
  
      const loadData=() => {
        calendarStore.loadEvents(authStore.token);
      };
  
      // 미니 달력
      const calendarRows = ref([]);
      const buildCalendar=(year, month)=>{
        // 1일이 무슨 요일인지, 그 달 총 길이
        const firstDate=new Date(year, month, 1);
        const firstDay= firstDate.getDay(); // 0(일) ~ 6(토)
        const lastDate= new Date(year, month+1, 0).getDate(); // ex) 3월 31일
        // 이전달 일부
        let daysArr=[];
        for(let i=0; i< firstDay; i++){
          const prevMonthLast = new Date(year, month, 0).getDate(); // 이전달 마지막일
          const dayNum= prevMonthLast - (firstDay -1) + i;
          const dateObj= new Date(year, month-1, dayNum);
          daysArr.push({day: dayNum, date: dateObj.toISOString().split("T")[0], otherMonth:true});
        }
        // 이번달
        for(let d=1; d<= lastDate; d++){
          const dateObj= new Date(year, month, d);
          daysArr.push({day:d, date: dateObj.toISOString().split("T")[0], otherMonth:false});
        }
        // 다음달
        while(daysArr.length%7!==0){
          const nextDay= daysArr.length- (firstDay+lastDate) +1;
          const dateObj= new Date(year, month+1, nextDay);
          daysArr.push({day: dateObj.getDate(), date: dateObj.toISOString().split("T")[0], otherMonth:true});
        }
  
        // weeks
        let rows=[];
        for(let i=0; i< daysArr.length; i+=7){
          rows.push(daysArr.slice(i,i+7));
        }
        calendarRows.value=rows;
      };
  
      const prevMonth=()=>{
        if(displayMonth.value===0){
          displayYear.value--;
          displayMonth.value=11;
        } else {
          displayMonth.value--;
        }
        buildCalendar(displayYear.value, displayMonth.value);
      };
      const nextMonth=()=>{
        if(displayMonth.value===11){
          displayYear.value++;
          displayMonth.value=0;
        } else {
          displayMonth.value++;
        }
        buildCalendar(displayYear.value, displayMonth.value);
      };
  
      const isToday=(dateStr)=>{
        const now= new Date();
        const nowStr= now.toISOString().split("T")[0];
        return nowStr=== dateStr;
      };
  
      const dayClick=(dateStr)=>{
        // 날짜 클릭 시 모달 열어서 새 이벤트 등록 or 편집?
        if(!isAdminOrProfessor.value) return;
        showModal.value=true;
        editEvent.value=null;
        title.value="";
        description.value="";
        eventDate.value=dateStr;
      };
  
      const openNewModal=()=>{
        showModal.value=true;
        editEvent.value=null;
        title.value=""; description.value=""; eventDate.value="";
      };
  
      const openEditModal=(ev)=>{
        if(!isAdminOrProfessor.value) return;
        showModal.value=true;
        editEvent.value=ev;
        title.value= ev.title;
        description.value= ev.description;
        eventDate.value= ev.event_date;
      };
  
      const closeModal=()=>{
        showModal.value=false;
        editEvent.value=null;
        title.value=""; description.value=""; eventDate.value="";
      };
  
      const submitEvent= async ()=>{
        if(!title.value || !eventDate.value){
          alert("제목과 날짜를 입력하세요");
          return;
        }
        try {
          const payload={ title: title.value, description: description.value, event_date: eventDate.value };
          if(!editEvent.value){
            // 등록
            await calendarStore.addEvent(authStore.token, payload);
            alert("행사 등록 완료");
          } else {
            // 수정
            await calendarStore.editEvent(authStore.token, editEvent.value.id, payload);
            alert("행사 수정 완료");
          }
          closeModal();
          loadData();
        } catch(err){
          alert("등록/수정 오류:"+ err.response?.data?.error);
        }
      };
  
      const deleteEvent= async ()=>{
        if(!confirm("이 행사를 삭제할까요?")) return;
        if(!editEvent.value) return;
        await calendarStore.removeEvent(authStore.token, editEvent.value.id);
        alert("행사 삭제 완료");
        closeModal();
        loadData();
      };
  
      const formatDate=(str)=>{
        const d= new Date(str);
        return `${d.getMonth()+1}월${d.getDate()}일`;
      };
  
      return {
        showModal, editEvent, title, description, eventDate,
        monthlyEvents, currentMonth, isAdminOrProfessor,
        displayYear, displayMonth, calendarRows, weekDays,
        loadData, buildCalendar, prevMonth, nextMonth, isToday, dayClick,
        openNewModal, openEditModal, closeModal, submitEvent, deleteEvent, formatDate
      };
    },
  };
  </script>
  
  <style scoped>
  .calendar-page {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
  }
  .calendar-layout {
    display: flex;
    gap: 20px;
  }
  /* 왼쪽 이벤트 목록 */
  .event-list {
    flex: 1;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
  }
  .event-list ul {
    list-style: none;
    padding: 0;
  }
  .event-list li {
    background: #eef;
    margin: 6px 0;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  .event-list li:hover {
    background: #dde;
  }
  .date-label {
    color: #f05a24;
    margin-right: 10px;
  }
  
  /* 오른쪽 달력 */
  .mini-calendar {
    width: 300px;
    background: #f0f0f0;
    border-radius: 6px;
    padding: 10px;
  }
  .calendar-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .mini-calendar table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
  }
  .mini-calendar th, .mini-calendar td {
    width: 14.2%;
    height: 40px;
    text-align: center;
    border: 1px solid #eee;
    cursor: pointer;
  }
  .other-month {
    color: #aaa;
  }
  .today {
    background: #ffffcc;
  }
  
  /* 모달 디자인은 main.css 참고 */
  </style>
  