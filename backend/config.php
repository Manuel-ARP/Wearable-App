<?php
// DB connection settings
$DB_HOST = 'localhost';
$DB_PORT = '3306';
$DB_NAME = 'wearable_db';
$DB_USER = 'root';
$DB_PASS = '';

$dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
?>
