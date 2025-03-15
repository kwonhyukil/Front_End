import pool from "../config/db.js"; // MySQL 데이터베이스 연결 풀
import path from "path"; // 파일 경로 관련 유틸리티
import fs from "fs"; // 파일 시스템 관련 모듈

/**
 * ✅ 공지사항 목록 조회 + 검색/필터 (학년, 제목)
 * - 특정 학년(target_grade)별 검색 가능
 * - 제목(title) 또는 내용(content)에서 키워드 검색 가능
 * - 중요 공지(is_important)는 먼저 표시되고, 최신순 정렬
 */
export const getNotices = async (req, res) => {
  try {
    const { grade, keyword } = req.query;
    const conditions = [];
    const params = [];

    let query = "SELECT * FROM notices";

    // 학년 필터 적용
    if (grade && grade !== "all") {
      conditions.push("target_grade=?");
      params.push(grade);
    }

    // 키워드 검색 (제목 또는 내용에서 검색)
    if (keyword) {
      conditions.push("(title LIKE ? OR content LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // 중요 공지를 먼저 표시하고 최신순 정렬
    query += " ORDER BY is_important DESC, created_at DESC";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "공지사항 목록 조회 오류" });
  }
};

/**
 * ✅ 공지사항 단일 조회
 * - 조회할 때 view_count(조회수)를 +1 증가
 */
export const getNoticeById = async (req, res) => {
  try {
    const id = req.params.id;

    // 조회수 증가
    await pool.query("UPDATE notices SET view_count=view_count+1 WHERE id=?", [
      id,
    ]);
    const [rows] = await pool.query("SELECT * FROM notices WHERE id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "해당 공지 없음" });
    }
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "공지사항 조회 오류" });
  }
};

/**
 * ✅ 공지사항 작성 + 첨부파일 업로드 (multer 사용)
 * - 관리자(1), 교수(2)만 작성 가능
 */
export const createNotice = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 작성 권한 없음" });
    }

    const { title, content, target_grade, is_important } = req.body;
    const authorId = req.user.id;

    // 공지사항 DB 삽입
    const [result] = await pool.query(
      `INSERT INTO notices (title, content, author_id, target_grade, is_important)
       VALUES (?,?,?,?,?)`,
      [title, content, authorId, target_grade || "all", is_important || false]
    );

    const noticeId = result.insertId; // 새로 생성된 공지사항 ID

    // 첨부파일이 있을 경우 저장
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          `INSERT INTO notice_attachments (notice_id, file_name, file_path)
           VALUES (?,?,?)`,
          [noticeId, file.originalname, file.path]
        );
      }
    }

    return res.json({ message: "공지사항 등록 완료", notice_id: noticeId });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 작성 오류" });
  }
};

/**
 * ✅ 공지사항 수정
 * - 관리자(1), 교수(2)만 수정 가능
 * - 기존 첨부파일 처리 로직은 포함되지 않음
 */
export const updateNotice = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 수정 권한 없음" });
    }
    const noticeId = req.params.id;
    const { title, content, target_grade, is_important } = req.body;

    // 공지사항 내용 업데이트
    await pool.query(
      `UPDATE notices SET title=?, content=?, target_grade=?, is_important=? WHERE id=?`,
      [title, content, target_grade, is_important, noticeId]
    );

    return res.json({ message: "공지사항 수정 완료" });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 수정 오류" });
  }
};

/**
 * ✅ 공지사항 삭제 (단일)
 * - 관리자(1), 교수(2)만 삭제 가능
 */
export const deleteNotice = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 삭제 권한 없음" });
    }

    const noticeId = req.params.id;
    await pool.query("DELETE FROM notices WHERE id=?", [noticeId]);

    return res.json({ message: "공지사항 삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 삭제 오류" });
  }
};

/**
 * ✅ 공지사항 다중 삭제
 * - 한 번에 여러 개의 공지사항을 삭제 가능
 * - 관리자(1), 교수(2)만 삭제 가능
 */
export const deleteNoticesBulk = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 삭제 권한 없음" });
    }

    const { ids } = req.body; // 삭제할 공지사항 ID 배열
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "삭제할 공지사항이 없습니다." });
    }

    // 여러 개의 ID를 한 번에 삭제 (IN 연산자 사용)
    const placeholders = ids.map(() => "?").join(",");
    await pool.query(`DELETE FROM notices WHERE id IN (${placeholders})`, ids);

    return res.json({ message: "선택된 공지사항 삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 다중 삭제 오류" });
  }
};

/**
 * ✅ 첨부파일 다운로드
 * - noticeAttachments 테이블에서 파일 정보 조회 후 다운로드
 */
export const downloadAttachment = async (req, res) => {
  try {
    const attachId = req.params.attachmentId;

    // 첨부파일 조회
    const [rows] = await pool.query(
      "SELECT * FROM notice_attachments WHERE id=?",
      [attachId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "파일 없음" });
    }

    const fileInfo = rows[0];
    const file = fileInfo.file_path; // 실제 파일 경로

    return res.download(file, fileInfo.file_name); // 파일 다운로드 응답
  } catch (error) {
    return res.status(500).json({ error: "파일 다운로드 오류" });
  }
};
