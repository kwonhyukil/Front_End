<?php
// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// URL에서 'id' 파라미터를 가져옵니다.
$id = $_GET['id'];

// 'posts' 테이블에서 특정 'id'에 해당하는 게시글을 조회하는 SQL 쿼리를 준비합니다.
$stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->execute([$id]);
$post = $stmt->fetch();

// 게시글이 존재하지 않으면 메시지를 출력하고 종료합니다.
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

    <!-- 데이터를 update.php로 POST 방식으로 전송하는 폼을 생성합니다 -->
    <form action="update.php" method="POST">
        <!-- 숨겨진 필드로 게시글 ID를 전달합니다 -->
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