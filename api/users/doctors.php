<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, full_name, email, specialization, experience_years, bio, verified
          FROM users 
          WHERE role = 'doctor'
          ORDER BY verified DESC, full_name ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($doctors);
?>
