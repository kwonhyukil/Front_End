// Smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Contact form validation
document
  .querySelector("#contactForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]');
    const email = this.querySelector('input[type="email"]');
    const message = this.querySelector("textarea");

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      alert("모든 입력 필드를 작성해주세요.");
      return;
    }

    alert("문의가 성공적으로 접수되었습니다!");
    this.reset();
  });

// Notice auto-slider (basic loop effect)
let currentNotice = 0;
const notices = [
  "[2025.03.02] 1학기 개강 안내",
  "[2025.02.15] 졸업 작품 전시회 개최",
  "[2025.01.20] 동계 계절학기 수강신청",
];
const noticeList = document.querySelector("#notices ul");

function rotateNotices() {
  if (!noticeList || notices.length === 0) return;
  noticeList.innerHTML = `<li>${notices[currentNotice]}</li>`;
  currentNotice = (currentNotice + 1) % notices.length;
}

setInterval(rotateNotices, 3500);
rotateNotices(); // 초기 실행

// Responsive nav toggle (optional if mobile nav is added later)
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("active");
  });
}
