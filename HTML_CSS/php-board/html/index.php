<?php
// 세션을 시작합니다.
session_start();

// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// 상대 시간을 계산하는 함수를 정의합니다.
function timeAgo($datetime)
{
    // 날짜 문자열을 유닉스 타임스탬프로 변환합니다.
    $time = strtotime($datetime);
    // 현재 시간과의 차이를 계산합니다.
    $diff = time() - $time;

    // 차이에 따라 적절한 상대 시간을 반환합니다.
    if ($diff < 60) return $diff . '초 전';
    elseif ($diff < 3600) return floor($diff / 60) . '분 전';
    elseif ($diff < 86400) return floor($diff / 3600) . '시간 전';
    elseif ($diff < 2592000) return floor($diff / 86400) . '일 전';
    else return date('Y-m-d', $time);
}

// 게시글, 작성자 이름, 좋아요 수를 조회하는 SQL 쿼리를 실행합니다.
$stmt = $pdo->query("
  SELECT posts.*, users.name AS author_name,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
  FROM posts
  JOIN users ON posts.user_id = users.id
  ORDER BY posts.id DESC
");
// 쿼리 결과를 모두 가져와 $posts 배열에 저장합니다.
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>게시판</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* 추가적인 CSS 스타일을 정의합니다 */
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
    <!-- 로그인 상태에 따라 사용자 정보를 표시하거나 로그인/회원가입 버튼을 제공합니다 -->
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

    <!-- 로그인한 사용자에게만 글쓰기 버튼과 게시글 목록을 표시합니다 -->
    <?php if (isset($_SESSION['user'])): ?>
        <a href="write.php" class="btn btn-primary mb-4">✏️ 글쓰기</a>
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