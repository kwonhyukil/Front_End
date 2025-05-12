<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/userController.php';
include_once 'header.php';

// 오류 메시지
$error = "";

// 회원가입 처리
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 사용자 등록
    if (registerUser($username, $password)) {
        // 성공 메시지
        $success = "회원가입이 완료되었습니다.";
        // 가입 후 로그인 페이지로 이동
        header("Location: login.php");
        exit;
    } else {
        // 오류 메시지
        $error = "회원가입에 실패했습니다. 아이디가 중복되었거나 잘못된 입력입니다.";
    }
}
?>

<h2>회원가입</h2>
<!-- 회원가입 폼 -->
<form method="POST">
    아이디: <input type="text" name="username" required><br>
    비밀번호: <input type="password" name="password" required><br>
    <button type="submit">가입하기</button>
</form>

<?php if ($error): ?>
    <p style="color: red;"><?php echo $error; ?></p>
<?php endif; ?>

<?php
// 공통 푸터 포함
include_once 'footer.php';
?>