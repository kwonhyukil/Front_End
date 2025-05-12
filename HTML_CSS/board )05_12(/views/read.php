<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/postController.php';
include_once 'header.php';

// URL에서 게시글 ID 가져오기
$id = $_GET['id'];
$post = getPost($id);

// 게시글이 존재하지 않을 때
if (!$post) {
    echo "<p>존재하지 않는 게시글입니다.</p>";
    include 'footer.php';
    exit;
}
?>

<h2><?php echo htmlspecialchars($post['title']); ?></h2>
<p>작성자: <?php echo htmlspecialchars($post['author']); ?></p>
<p><?php echo nl2br(htmlspecialchars($post['content'])); ?></p>
<p>작성일: <?php echo $post['created_at']; ?></p>

<!-- 수정/삭제 버튼 (작성자만 표시) -->
<?php if (isLoggedIn() && currentUser() === $post['author']): ?>
    <a href="edit.php?id=<?php echo $id; ?>">수정</a>
    <a href="delete.php?id=<?php echo $id; ?>" onclick="return confirm('정말 삭제하시겠습니까?');">삭제</a>
    <a href="index.php">목록</a>
<?php endif; ?>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>