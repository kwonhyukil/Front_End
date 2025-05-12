<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/userController.php';
include_once 'header.php';

// 로그인 처리
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 로그인 시도
    if (loginUser($username, $password)) {
        header("Location: index.php");
        exit;
    } else {
        $error = "아이디 또는 비밀번호가 잘못되었습니다.";
    }
}
?>

<h2>로그인</h2>
<!-- 로그인 폼 -->
<form method="POST">
    아이디: <input type="text" name="username" value="" required><br>
    비밀번호: <input type="password" name="password" required><br>
    <button type=" submit">로그인</button>
</form>

<!-- 로그인 오류 메시지 표시 -->
<?php if (isset($error)): ?>
    <p style="color: red;"><?php echo $error; ?></p>
<?php endif; ?>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>