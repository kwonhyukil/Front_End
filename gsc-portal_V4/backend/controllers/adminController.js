import db from "../config/db.js";

// 🔹 대기 중인 회원 목록 조회
export const getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM registrations");
    res.json(users);
  } catch (error) {
    console.error("회원 승인 대기 목록 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 🔹 회원 승인 기능 (`registrations` → `users` 이동)
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // `registrations`에서 회원 정보 가져오기
    const [user] = await db.query("SELECT * FROM registrations WHERE id = ?", [
      userId,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    }

    // 회원 정보를 `users` 테이블에 삽입
    await db.query(
      "INSERT INTO users (name, student_id, phone, email, is_international) VALUES (?, ?, ?, ?, ?)",
      [
        user[0].name,
        user[0].student_id,
        user[0].phone,
        user[0].email,
        user[0].is_international,
      ]
    );

    // 승인 후 `registrations`에서 삭제
    await db.query("DELETE FROM registrations WHERE id = ?", [userId]);

    res.json({ message: "회원이 승인되었습니다." });
  } catch (error) {
    console.error("회원 승인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
