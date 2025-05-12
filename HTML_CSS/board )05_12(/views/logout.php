<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';

// 로그아웃 처리
logoutUser();

// 로그아웃 후 로그인 페이지로 이동
header("Location: login.php");
exit;
