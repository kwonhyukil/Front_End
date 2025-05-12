<?php
// 세션을 시작합니다.
session_start();

// 현재 세션을 파괴하여 모든 세션 데이터를 삭제합니다.
session_destroy();

// 메인 페이지(index.php)로 리다이렉트합니다.
header("Location: index.php");

// 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
exit;
