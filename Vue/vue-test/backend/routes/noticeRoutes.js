const express = require("express");
const { getNotices, createNotice } = require("../controllers/noticeController");

const router = express.Router();

// 공지사항 조회 API
router.get("/", getNotices);

// 공지사항 추가 API
router.post("/", createNotice);

module.exports = router;
