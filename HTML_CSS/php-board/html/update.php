<?php
// 세션을 시작합니다.
session_start();

// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// POST 요청으로 전송된 'id', 'title', 'content' 값을 가져옵니다.
$id = $_POST['id'];
$title = $_POST['title'];
$content = $_POST['content'];

// 'posts' 테이블에서 특정 'id'에 해당하는 게시글의 제목과 내용을 업데이트하는 SQL 쿼리를 준비합니다.
$stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?");

// 준비된 쿼리에 제목, 내용, ID를 바인딩하고 실행하여 게시글을 업데이트합니다.
$stmt->execute([$title, $content, $id]);

// 업데이트가 완료되면 해당 게시글의 상세 페이지로 리다이렉트합니다.
header("Location: view.php?id=$id");

// 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
exit();
