<?php
// DB 연결 파일 포함
include_once '../config/db.php';

// 게시글 추가 함수
function addPost($title, $content, $author)
{
    $conn = dbConnect();

    // SQL 준비 - 게시글 정보 삽입
    $stmt = $conn->prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $content, $author);
    $stmt->execute();

    // 자원 해제
    $stmt->close();
    $conn->close();
}

// 게시글 목록 가져오기 함수
function getPosts()
{
    $conn = dbConnect();

    // 게시글을 최신순으로 가져옴
    $result = $conn->query("SELECT * FROM posts ORDER BY created_at DESC");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// 특정 게시글 가져오기 함수
function getPost($id)
{
    $conn = dbConnect();

    // SQL 준비 - 특정 게시글 조회
    $stmt = $conn->prepare("SELECT * FROM posts WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $post = $result->fetch_assoc();

    // 자원 해제
    $stmt->close();
    $conn->close();
    return $post;
}

// 게시글 수정 함수
function updatePost($id, $title, $content)
{
    $conn = dbConnect();

    // SQL 준비 - 게시글 수정
    $stmt = $conn->prepare("UPDATE posts SET title=?, content=? WHERE id=?");
    $stmt->bind_param("ssi", $title, $content, $id);
    $stmt->execute();

    // 자원 해제
    $stmt->close();
    $conn->close();
}

// 게시글 삭제 함수
function deletePost($id)
{
    $conn = dbConnect();

    // SQL 준비 - 게시글 삭제
    $stmt = $conn->prepare("DELETE FROM posts WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // 자원 해제
    $stmt->close();
    $conn->close();
}
