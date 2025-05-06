<?php
require_once 'db.php';

$id = $_GET['id'];

$stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->execute([$id]);
$post = $stmt->fetch();

if (!$post) {
    die("게시물이 존재하지 않습니다.");
}
?>


<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>글 수정</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container my-5">

    <h1 class="mb-4">글 수정</h1>

    <form action="update.php" method="POST">
        <input type="hidden" name="id" value="<?= $post['id'] ?>">

        <div class="mb-3">
            <label for="title" class="form-label">제목</label>
            <input type="text" name="title" id="title" class="form-control" value="<?= htmlspecialchars($post['title']) ?>" required>
        </div>

        <div class="mb-3">
            <label for="content" class="form-label">내용</label>
            <textarea name="content" id="content" class="form-control" rows="10" required><?= htmlspecialchars($post['content']) ?></textarea>
        </div>

        <button type="submit" class="btn btn-warning">수정하기</button>
        <button type="button" class="btn btn-secondary" onclick="location.href='index.php'">취소</button>
    </form>

    <div class="mt-3">
        <a href="view.php?id=<?= $post['id'] ?>" class="btn btn-outline-primary">← 글로 돌아가기</a>
    </div>

</body>

</html>