// [경로: backend/controllers/noticeController.js]
import pool from "../config/db.js";
import fs from "fs";
import path from "path";

/**
 * 공지사항 목록 조회 (필터: grade, keyword)
 * 중요 공지 is_important=true 우선 정렬
 */
export const getNotices = async (req, res) => {
  try {
    const { grade, keyword } = req.query;
    const conditions = [];
    const params = [];

    let query = "SELECT * FROM notices";

    if (grade && grade !== "all") {
      conditions.push("target_grade=?");
      params.push(grade);
    }
    if (keyword) {
      conditions.push("(title LIKE ? OR content LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY is_important DESC, created_at DESC";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "공지사항 목록 조회 오류" });
  }
};

/**
 * 공지사항 단일 조회 + 조회수 증가
 */
export const getNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;
    await pool.query("UPDATE notices SET view_count=view_count+1 WHERE id=?", [
      noticeId,
    ]);
    const [rows] = await pool.query("SELECT * FROM notices WHERE id=?", [
      noticeId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "공지사항이 존재하지 않습니다." });
    }
    // 첨부파일
    const [files] = await pool.query(
      "SELECT * FROM attachments WHERE notice_id=?",
      [noticeId]
    );
    return res.json({ notice: rows[0], attachments: files });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 조회 오류" });
  }
};

/**
 * 공지사항 작성
 * 첨부파일 -> attachments 테이블에 저장
 */
export const createNotice = async (req, res) => {
  try {
    // 관리자 or 교수만
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 작성 권한이 없습니다." });
    }
    const { title, content, target_grade, is_important } = req.body;
    const authorId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO notices (title, content, author_id, target_grade, is_important)
       VALUES (?,?,?,?,?)`,
      [title, content, authorId, target_grade || "all", is_important === "true"]
    );
    const noticeId = result.insertId;

    // 첨부파일 처리
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          `INSERT INTO attachments (notice_id, file_path, file_type)
           VALUES (?,?,?)`,
          [noticeId, file.path, file.mimetype]
        );
      }
    }

    return res.json({ message: "공지사항 작성 완료", notice_id: noticeId });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 작성 오류" });
  }
};

/**
 * 공지사항 수정
 */
export const updateNotice = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 수정 권한이 없습니다." });
    }
    const noticeId = req.params.id;
    const { title, content, target_grade, is_important } = req.body;

    await pool.query(
      `UPDATE notices SET title=?, content=?, target_grade=?, is_important=?
       WHERE id=?`,
      [title, content, target_grade, is_important === "true", noticeId]
    );

    // 첨부파일 수정(교체, 삭제 등)은 추가 구현 가능
    // 예: 기존 파일 삭제 후 새 파일 삽입

    return res.json({ message: "공지사항 수정 완료" });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 수정 오류" });
  }
};

/**
 * 공지사항 단일 삭제
 */
export const deleteNotice = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 삭제 권한이 없습니다." });
    }
    const noticeId = req.params.id;
    await pool.query("DELETE FROM notices WHERE id=?", [noticeId]);
    return res.json({ message: "공지사항이 삭제되었습니다." });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 삭제 오류" });
  }
};

/**
 * 공지사항 다중 삭제
 */
export const deleteNoticesBulk = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "공지사항 삭제 권한이 없습니다." });
    }
    const { ids } = req.body; // [1,2,3,...]
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "삭제할 공지사항이 없습니다." });
    }
    const placeholders = ids.map(() => "?").join(",");
    await pool.query(`DELETE FROM notices WHERE id IN (${placeholders})`, ids);
    return res.json({ message: "선택된 공지사항 삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "공지사항 다중 삭제 오류" });
  }
};

/**
 * 첨부파일 다운로드
 */
export const downloadAttachment = async (req, res) => {
  try {
    const attachmentId = req.params.attachmentId;
    const [rows] = await pool.query("SELECT * FROM attachments WHERE id=?", [
      attachmentId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "첨부파일이 존재하지 않습니다." });
    }
    const fileInfo = rows[0];
    return res.download(fileInfo.file_path, path.basename(fileInfo.file_path));
  } catch (error) {
    return res.status(500).json({ error: "첨부파일 다운로드 오류" });
  }
};
