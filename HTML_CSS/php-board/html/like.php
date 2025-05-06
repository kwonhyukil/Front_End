<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo "로그인이 필요합니다.";
    exit;
}

$user_id = $_SESSION['user']['id'];
$post_id = $_GET['post_id'];

// 이미 좋아요 했는지 확인
$stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND post_id = ?");
$stmt->execute([$user_id, $post_id]);

if ($stmt->fetch()) {
    // 이미 좋아요한 경우: 취소
    $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?")->execute([$user_id, $post_id]);
} else {
    // 좋아요 등록
    $pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)")->execute([$user_id, $post_id]);
}

header("Location: view.php?id=$post_id");
exit;
