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
    !empty($data->doctor_id) &&
    !empty($data->date) &&
    !empty($data->time)
){
    $query = "INSERT INTO appointments SET user_id=:user_id, doctor_id=:doctor_id, appointment_date=:date, appointment_time=:time, notes=:notes, status='pending'";
    $stmt = $db->prepare($query);

    $data->notes = isset($data->notes) ? htmlspecialchars(strip_tags($data->notes)) : '';

    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":doctor_id", $data->doctor_id);
    $stmt->bindParam(":date", $data->date);
    $stmt->bindParam(":time", $data->time);
    $stmt->bindParam(":notes", $data->notes);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(["message" => "Appointment booked successfully."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to book appointment."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>



