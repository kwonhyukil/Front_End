<?php
// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다.
require_once 'db.php';

// POST 요청으로 전송된 제목과 내용을 가져옵니다.
$title = $_POST['title'];
$content = $_POST['content'];

// 'posts' 테이블에 제목과 내용을 삽입하는 SQL 쿼리를 준비합니다.
$stmt = $pdo->prepare("INSERT INTO posts (title, content) VALUES (?, ?)");

// 준비된 쿼리에 제목과 내용을 바인딩하고 실행하여 게시글을 삽입합니다.
$stmt->execute([$title, $content]);

// 삽입이 완료되면 메인 페이지(index.php)로 리다이렉트합니다.
header("Location: index.php");

// 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
exit();
