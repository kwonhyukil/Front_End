<!DOCTYPE html>
<html lang="ko">
<head>
    <title>커뮤니티 게시판</title>

</head>
<body>
    <header>
        <h1>커뮤니티 게시판</h1>
        <nav>
            <a href="index.php">홈</a>
            <?php if (isLoggedIn()): ?>
                <a href="write.php">글 작성</a>
                <a href="logout.php">로그아웃</a>
                <span>환영합니다, <?php echo currentUser(); ?>님</span>
            <?php else: ?>
                <a href="login.php">로그인</a>
                <a href="register.php">회원가입</a>
            <?php endif; ?>
        </nav>
        <hr>
    </header>
