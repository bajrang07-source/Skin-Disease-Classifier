<?php
// Start output buffering to ensure headers are sent first
ob_start();

// Set CORS headers IMMEDIATELY
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
$role = isset($_GET['role']) ? $_GET['role'] : 'user';

if($role == 'doctor'){
    $query = "SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes, u.full_name as patient_name 
              FROM appointments a 
              JOIN users u ON a.user_id = u.id 
              WHERE a.doctor_id = :user_id 
              ORDER BY a.appointment_date DESC, a.appointment_time DESC";
} else {
    $query = "SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes, u.full_name as doctor_name 
              FROM appointments a 
              JOIN users u ON a.doctor_id = u.id 
              WHERE a.user_id = :user_id 
              ORDER BY a.appointment_date DESC, a.appointment_time DESC";
}

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $user_id);
$stmt->execute();

$appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($appointments);
?>
