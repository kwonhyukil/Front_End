<?php
// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// HTTP 요청이 POST 방식인지 확인합니다.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 폼에서 제출된 이름, 이메일, 비밀번호를 가져옵니다.
    $name = $_POST['name'];
    $email = $_POST['email'];
    // 비밀번호를 해시하여 보안성을 높입니다.
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // 'users' 테이블에 이름, 이메일, 해시된 비밀번호를 삽입하는 SQL 쿼리를 준비합니다.
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    // 준비된 쿼리에 값을 바인딩하고 실행하여 사용자를 등록합니다.
    $stmt->execute([$name, $email, $pass]);

    // 등록이 완료되면 로그인 페이지로 리다이렉트합니다.
    header("Location: login.php");
    // 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
    exit;
}
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>회원가입</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container my-5">
    <h1 class="mb-4">회원가입</h1>

    <!-- 데이터를 register.php로 POST 방식으로 전송하는 폼을 생성합니다 -->
    <form method="POST">
        <div class="mb-3">
            <label class="form-label">이름</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">이메일</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">비밀번호</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">가입하기</button>
        <a href="login.php" class="btn btn-secondary">로그인</a>
    </form>
</body>

</html>