<?php
require_once 'db.php';

$id = $_GET['id'];

$stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
$stmt->execute([$id]);

header("location: index.php");
exit();
