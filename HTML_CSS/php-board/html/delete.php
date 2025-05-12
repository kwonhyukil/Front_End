<?php
// 데이터베이스 연결 설정이 포함된 db.php 파일을 불러옵니다. 이 파일은 $pdo 객체를 생성합니다.
require_once 'db.php';

// URL에서 'id' 파라미터를 가져옵니다. 이는 삭제할 게시글의 고유 식별자입니다.
$id = $_GET['id'];

// 'posts' 테이블에서 특정 'id'에 해당하는 게시글을 삭제하는 SQL 쿼리를 준비합니다.
// ?는 플레이스홀더로, 나중에 $id 값을 바인딩합니다.
$stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");

// 준비된 쿼리에 'id' 값을 바인딩하고 실행하여 게시글을 삭제합니다.
$stmt->execute([$id]);

// 삭제가 완료되면 메인 페이지(index.php)로 리다이렉트합니다.
header("location: index.php");

// 리다이렉트 후 추가 코드 실행을 방지하기 위해 스크립트를 종료합니다.
exit();