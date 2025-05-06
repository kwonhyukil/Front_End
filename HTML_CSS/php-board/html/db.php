<?php
$host = 'db';
$dbname = 'boarddb';
$user = 'boarduser';
$pass = 'boardpw';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    die("DB 연결 실패: " . $e->getMessage());
}
