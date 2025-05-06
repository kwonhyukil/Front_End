<?php
session_start();
require_once 'db.php';

// 로그인 안 했으면 글쓰기 제한
if (!isset($_SESSION['user'])) {
    die('로그인 후 작성 가능합니다.');
}

// 글 등록 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $content = trim($_POST['content']);
    $userId = $_SESSION['user']['id'];

    if ($title && $content) {
        $stmt = $pdo->prepare("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)");
        $stmt->execute([$title, $content, $userId]);
        header("Location: index.php");
        exit;
    } else {
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

    <?php if (isset($error)): ?>
        <div class="alert alert-danger"><?= $error ?></div>
    <?php endif; ?>

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