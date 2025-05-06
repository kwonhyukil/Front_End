<?php
session_start();
require_once 'db.php';

$id = $_POST['id'];
$title = $_POST['title'];
$content = $_POST['content'];

$stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?");
$stmt->execute([$title, $content, $id]);

header("Location: view.php?id=$id");
exit();
