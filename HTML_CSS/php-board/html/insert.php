<?php
require_once 'db.php';

$title = $_POST['title'];
$content = $_POST['content'];

$stmt = $pdo->prepare("INSERT INTO posts (title, content) VALUES (?, ?)");
$stmt->execute([$title, $content]);

header("Location: index.php");
exit();
