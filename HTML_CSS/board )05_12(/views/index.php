<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/postController.php';
include_once 'header.php';

// 게시글 목록 가져오기
$posts = getPosts();
?>

<h2>게시글 목록</h2>
<!-- 게시글 목록 표시 -->
<?php foreach ($posts as $post): ?>
    <div class="post">
        <h3>
            <!-- 게시글 제목 클릭 시 상세 페이지로 이동 -->
            <a href="read.php?id=<?php echo $post['id']; ?>">
                <?php echo htmlspecialchars($post['title']); ?>
            </a>
        </h3>
        <p>작성자: <?php echo htmlspecialchars($post['author']); ?> | 작성일: <?php echo $post['created_at']; ?></p>
    </div>
<?php endforeach; ?>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>