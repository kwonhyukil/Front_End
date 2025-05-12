<?php
// 세션을 시작합니다.
session_start();

// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// 오류 메시지를 저장할 변수를 초기화합니다.
$error = '';

// HTTP 요청이 POST 방식인지 확인합니다.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 폼에서 제출된 이메일과 비밀번호를 가져옵니다.
    $email = $_POST['email'];
    $password = $_POST['password'];

    // 'users' 테이블에서 이메일로 사용자를 조회하는 SQL 쿼리를 준비합니다.
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    // 쿼리를 실행하고 결과를 가져옵니다.
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // 사용자가 존재하고, 비밀번호가 일치하는지 확인합니다.
    if ($user && password_verify($password, $user['password'])) {
        // 세션에 사용자 정보를 저장합니다.
        $_SESSION['user'] = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ];
        // 로그인 성공 시 메인 페이지로 리다이렉트합니다.
        header("Location: index.php");
        exit;
    } else {
        // 로그인 실패 시 오류 메시지를 설정합니다.
        $error = "이메일 또는 비밀번호가 올바르지 않습니다.";
    }
}
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>로그인</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container my-5">
    <h1 class="mb-4">로그인</h1>

    <!-- 오류 메시지가 있을 경우 경고창을 표시합니다 -->
    <?php if ($error): ?>
        <div class="alert alert-danger"><?= $error ?></div>
    <?php endif; ?>

    <!-- 데이터를 login.php로 POST 방식으로 전송하는 폼을 생성합니다 -->
    <form method="POST">
        <div class="mb-3">
            <label class="form-label">이메일</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">비밀번호</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">로그인</button>
        <a href="register.php" class="btn btn-secondary">회원가입</a>
    </form>
</body>

</html>