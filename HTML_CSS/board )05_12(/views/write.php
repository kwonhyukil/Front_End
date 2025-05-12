<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/postController.php';
include_once 'header.php';

// 로그인 여부 확인
if (!isLoggedIn()) {
    echo "<p>로그인 후 작성할 수 있습니다.</p>";
    include 'footer.php';
    exit;
}

// 게시글 작성 처리
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $author = currentUser();

    // 게시글 추가
    addPost($title, $content, $author);
    header("Location: index.php");
    exit;
}
?>

<h2>글 작성</h2>
<form method="POST">
    제목: <input type="text" name="title" required><br>
    내용: <textarea name="content" required></textarea><br>
    <button type="submit">작성</button>
</form>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>