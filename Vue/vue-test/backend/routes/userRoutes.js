const express = require("express");
const { getUsers, addUser } = require("../controllers/userController");

const router = express.Router();

// 모든 사용자 조회 API
router.get("/", getUsers);

// 사용자 추가 API
router.post("/", addUser);

module.exports = router;
