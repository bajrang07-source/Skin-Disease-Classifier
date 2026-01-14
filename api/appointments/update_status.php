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

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->appointment_id) &&
    !empty($data->status)
){
    $query = "UPDATE appointments SET status = :status WHERE id = :appointment_id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":appointment_id", $data->appointment_id);

    if($stmt->execute()){
        http_response_code(200);
        echo json_encode(["message" => "Appointment status updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update appointment."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
