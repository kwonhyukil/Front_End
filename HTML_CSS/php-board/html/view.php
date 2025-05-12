<?php
// 세션을 시작합니다.
session_start();

// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// URL에서 'id' 파라미터를 가져옵니다. 없으면 null로 설정합니다.
$id = $_GET['id'] ?? null;

// 'id'가 없으면 유효하지 않은 접근으로 간주하고 종료합니다.
if (!$id) {
    die("유효하지 않은 접근입니다.");
}

// 'posts' 테이블에서 해당 게시글의 조회수를 1 증가시키는 SQL 쿼리를 실행합니다.
$pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = ?")->execute([$id]);

// 'posts' 테이블에서 특정 'id'에 해당하는 게시글을 조회하는 SQL 쿼리를 준비합니다.
$stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->execute([$id]);
$post = $stmt->fetch();

// 게시글이 존재하지 않으면 메시지를 출력하고 종료합니다.
if (!$post) {
    die("게시물이 존재하지 않습니다.");
}

// 'likes' 테이블에서 해당 게시글의 좋아요 수를 조회하는 SQL 쿼리를 준비합니다.
$stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ?");
$stmt->execute([$id]);
$likeCount = $stmt->fetchColumn();

// 사용자가 이미 좋아요를 눌렀는지 확인합니다.
$alreadyLiked = false;
if (isset($_SESSION['user'])) {
    $userId = $_SESSION['user']['id'];
    $stmt = $pdo->prepare("SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?");
    $stmt->execute([$userId, $id]);
    $alreadyLiked = $stmt->fetch() ? true : false;
}
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>글 상세보기</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container my-5">
    <h1 class="mb-4">글 상세보기</h1>

    <!-- 게시글의 제목, 내용, 작성일을 표시합니다 -->
    <div class="card">
        <div class="card-body">
            <h4 class="card-title"><?= htmlspecialchars($post['title']) ?></h4>
            <p class="card-text"><?= nl2br(htmlspecialchars($post['content'])) ?></p>
            <p class="text-muted">작성일: <?= $post['created_at'] ?></p>
        </div>
    </div>

    <!-- 목록으로, 수정, 삭제 버튼을 제공합니다 -->
    <div class="mt-4">
        <a href="index.php" class="btn btn-secondary">← 목록으로</a>
        <a href="edit.php?id=<?= $post['id'] ?>" class="btn btn-warning">수정</a>
        <a href="delete.php?id=<?= $post['id'] ?>" class="btn btn-danger" onclick="return confirm('정말 삭제하시겠습니까?');">삭제</a>
    </div>

    <!-- 로그인한 사용자에게 좋아요 버튼을 제공합니다 -->
    <div class="mt-3">
        <?php if (isset($_SESSION['user'])): ?>
            <form action="like.php" method="get" class="d-inline">
                <input type="hidden" name="post_id" value="<?= $post['id'] ?>">
                <button type="submit" class="btn <?= $alreadyLiked ? 'btn-secondary' : 'btn-outline-danger' ?>">
                    <?= $alreadyLiked ? '💔 좋아요 취소' : '❤️ 좋아요' ?> (<?= $likeCount ?>)
                </button>
            </form>
        <?php else: ?>
            <p class="text-muted">❤️ 좋아요 (<?= $likeCount ?>) — 로그인 후 이용 가능합니다</p>
        <?php endif; ?>
    </div>
</body>

</html>