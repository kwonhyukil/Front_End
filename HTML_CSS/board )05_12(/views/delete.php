<?php
// 공통 설정 및 헤더 포함
include_once '../config/db.php';
include_once '../controllers/postController.php';

// 게시글 ID 가져오기
$id = $_GET['id'];
$post = getPost($id);

// 게시글이 존재하지 않으면 오류 메시지 출력
if (!$post) {
    echo "<p>존재하지 않는 게시글입니다.</p>";
    exit;
}

// 삭제 권한 확인 (로그인 상태 및 작성자 여부)
if (!isLoggedIn() || currentUser() !== $post['author']) {
    echo "<p>삭제 권한이 없습니다.</p>";
    exit;
}

// 게시글 삭제 실행
deletePost($id);

// 삭제 후 메인 페이지로 이동
header("Location: index.php");
exit;
