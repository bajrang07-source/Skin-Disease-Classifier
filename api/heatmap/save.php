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
    !empty($data->prediction_id) &&
    !empty($data->heatmap_image_path)
){
    $query = "INSERT INTO heatmap_data SET prediction_id=:prediction_id, heatmap_image_path=:heatmap_image_path";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":prediction_id", $data->prediction_id);
    $stmt->bindParam(":heatmap_image_path", $data->heatmap_image_path);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(["message" => "Heatmap saved."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to save heatmap."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
