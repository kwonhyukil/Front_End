<?php
session_start();
require_once 'db.php';

// 상대 시간 함수
function timeAgo($datetime)
{
    $time = strtotime($datetime);
    $diff = time() - $time;

    if ($diff < 60) return $diff . '초 전';
    elseif ($diff < 3600) return floor($diff / 60) . '분 전';
    elseif ($diff < 86400) return floor($diff / 3600) . '시간 전';
    elseif ($diff < 2592000) return floor($diff / 86400) . '일 전';
    else return date('Y-m-d', $time);
}

// 게시글 + 작성자 + 좋아요 수 가져오기
$stmt = $pdo->query("
  SELECT posts.*, users.name AS author_name,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
  FROM posts
  JOIN users ON posts.user_id = users.id
  ORDER BY posts.id DESC
");
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>게시판</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .card-title a {
            text-decoration: none;
            color: #222;
        }

        .card-title a:hover {
            text-decoration: underline;
            color: #0d6efd;
        }

        .post-meta {
            font-size: 0.9rem;
            color: #555;
        }

        .card:hover {
            background-color: #f9f9f9;
        }
    </style>
</head>

<body class="container my-5">

    <!-- 상단 유저 정보 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>📋 게시판</h1>
        <div>
            <?php if (isset($_SESSION['user'])): ?>
                <span class="me-3">👤 <?= htmlspecialchars($_SESSION['user']['name']) ?>님</span>
                <a href="logout.php" class="btn btn-outline-secondary btn-sm">로그아웃</a>
            <?php else: ?>
                <a href="login.php" class="btn btn-outline-primary btn-sm">로그인</a>
                <a href="register.php" class="btn btn-outline-success btn-sm">회원가입</a>
            <?php endif; ?>
        </div>
    </div>

    <?php if (isset($_SESSION['user'])): ?>
        <!-- 글쓰기 버튼 -->
        <a href="write.php" class="btn btn-primary mb-4">✏️ 글쓰기</a>

        <!-- 게시글 목록 -->
        <?php if (count($posts) === 0): ?>
            <div class="alert alert-warning">작성된 글이 없습니다.</div>
        <?php else: ?>
            <?php foreach ($posts as $post): ?>
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">
                            <a href="view.php?id=<?= $post['id'] ?>">
                                <?= htmlspecialchars($post['title']) ?>
                            </a>
                        </h5>
                        <p class="card-text text-muted mb-2" style="font-size: 0.95rem;">
                            <?= nl2br(htmlspecialchars(mb_strimwidth($post['content'], 0, 100, '...'))) ?>
                        </p>
                        <p class="post-meta">
                            🧑 <?= htmlspecialchars($post['author_name']) ?> |
                            ❤️ <?= $post['like_count'] ?>개 |
                            👁️ <?= $post['views'] ?>회 |
                            🕓 <?= timeAgo($post['created_at']) ?>
                        </p>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    <?php else: ?>
        <div class="alert alert-danger">
            게시글을 확인하려면 <a href="login.php" class="alert-link">로그인</a>이 필요합니다.
        </div>
    <?php endif; ?>

</body>

</html>