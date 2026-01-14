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
    !empty($data->user_id) &&
    !empty($data->scheduled_at)
){
    // Here we would trigger the external calling API
    // For now, we just save to DB
    
    $query = "INSERT INTO scheduled_calls SET user_id=:user_id, scheduled_at=:scheduled_at, status='scheduled'";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":scheduled_at", $data->scheduled_at);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(["message" => "Call scheduled successfully."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to schedule call."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
