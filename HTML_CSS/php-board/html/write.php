<?php
// 세션을 시작합니다. 세션은 사용자의 로그인 상태를 유지하기 위해 필요합니다.
session_start();

// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// 사용자가 로그인했는지 확인합니다. 세션에 'user' 키가 없으면 접근을 차단합니다.
if (!isset($_SESSION['user'])) {
    die('로그인 후 작성 가능합니다.');
}

// HTTP 요청이 POST 방식인지 확인합니다. 이는 폼이 제출되었을 때 실행됩니다.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 폼에서 제출된 제목을 가져오고, 양쪽 공백을 제거합니다.
    $title = trim($_POST['title']);
    // 폼에서 제출된 내용을 가져오고, 양쪽 공백을 제거합니다.
    $content = trim($_POST['content']);
    // 세션에서 현재 로그인한 사용자의 ID를 가져옵니다.
    $userId = $_SESSION['user']['id'];

    // 제목과 내용이 모두 입력되었는지 확인합니다.
    if ($title && $content) {
        // 'posts' 테이블에 제목, 내용, 사용자 ID를 삽입하는 SQL 쿼리를 준비합니다.
        $stmt = $pdo->prepare("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)");
        // 준비된 쿼리에 값을 바인딩하고 실행하여 게시글을 삽입합니다.
        $stmt->execute([$title, $content, $userId]);
        // 삽입이 완료되면 메인 페이지(index.php)로 리다이렉트합니다.
        header("Location: index.php");
        // 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
        exit;
    } else {
        // 제목 또는 내용이 비어 있으면 오류 메시지를 설정합니다.
        $error = "제목과 내용을 모두 입력해주세요.";
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>글쓰기</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container my-5">
    <h1 class="mb-4">✏️ 글쓰기</h1>

    <!-- 오류 메시지가 있을 경우 경고창을 표시합니다 -->
    <?php if (isset($error)): ?>
        <div class="alert alert-danger"><?= $error ?></div>
    <?php endif; ?>

    <!-- 데이터를 write.php로 POST 방식으로 전송하는 폼을 생성합니다 -->
    <form method="POST" action="write.php">
        <div class="mb-3">
            <label for="title" class="form-label">제목</label>
            <input type="text" name="title" id="title" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="content" class="form-label">내용</label>
            <textarea name="content" id="content" rows="10" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">작성하기</button>
        <a href="index.php" class="btn btn-secondary">취소</a>
    </form>
</body>
</html>