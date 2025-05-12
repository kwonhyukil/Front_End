<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/postController.php';
include_once 'header.php';

// 게시글 ID 가져오기
$id = $_GET['id'];
$post = getPost($id);

// 수정 권한 확인
if (!isLoggedIn() || currentUser() !== $post['author']) {
    echo "<p>수정 권한이 없습니다.</p>";
    include_once 'footer.php';
    exit;
}

// 수정 처리
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    updatePost($id, $title, $content);
    header("Location: read.php?id=$id");
    exit;
}
?>

<h2>글 수정</h2>
<form method="POST">
    제목: <input type="text" name="title" value="<?php echo htmlspecialchars($post['title']); ?>" required><br>
    내용: <textarea name="content" required><?php echo htmlspecialchars($post['content']); ?></textarea><br>
    <button type="submit">수정</button>
</form>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>