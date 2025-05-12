<?php
// 세션 시작 - 로그인 상태 유지
session_start();

// 이미 포함된 경우 중복 방지
if (function_exists('dbConnect')) {
    return;
}

// 데이터베이스 연결 함수
function dbConnect()
{
    $host = '210.101.236.159';    // 서버 IP 주소
    $user = 'root';               // MySQL 사용자 이름
    $password = 'gsc1234!@#$';    // MySQL 비밀번호
    $dbname = 'il_board';         // 데이터베이스 이름

    // MySQL 데이터베이스 연결 생성
    $conn = new mysqli($host, $user, $password, $dbname);

    // 연결 확인 - 실패 시 오류 메시지 출력 후 종료
    if ($conn->connect_error) {
        die("DB 연결 실패: " . $conn->connect_error);
    }
    return $conn;
}

// 로그인 상태 확인 함수
function isLoggedIn()
{
    return isset($_SESSION['username']);
}

// 현재 로그인된 사용자 이름 반환 함수
function currentUser()
{
    return $_SESSION['username'] ?? '익명';
}

// 로그아웃 함수 - 세션 종료
function logoutUser()
{
    session_unset();
    session_destroy();
}
