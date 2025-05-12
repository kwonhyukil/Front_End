<?php
// DB 연결 파일 포함
include_once '../config/db.php';

// 사용자 등록 함수 (회원가입)
function registerUser($username, $password)
{
    $conn = dbConnect();  // DB 연결

    // 중복 아이디 검사
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // 아이디가 이미 존재하면 false 반환
    if ($result->num_rows > 0) {
        return false;
    }

    // 비밀번호 해싱 (암호화)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // SQL 준비 - 사용자 정보 삽입
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashedPassword);
    $stmt->execute();

    // 자원 해제
    $stmt->close();
    $conn->close();
    return true; // 회원가입 성공시
}

// 사용자 로그인 함수
function loginUser($username, $password)
{
    $conn = dbConnect();  // DB 연결

    // SQL 준비 - 사용자 조회
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // 자원 해제
    $stmt->close();
    $conn->close();

    // 비밀번호 검증 후 세션 저장
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['username'] = $user['username'];
        return true;
    }
    return false;
}
