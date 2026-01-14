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
    !empty($data->image_path) &&
    !empty($data->prediction_result)
){
    $query = "INSERT INTO predictions SET user_id=:user_id, image_path=:image_path, prediction_result=:prediction_result, confidence_score=:confidence_score";
    $stmt = $db->prepare($query);

    $data->confidence_score = isset($data->confidence_score) ? $data->confidence_score : 0.0;

    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":image_path", $data->image_path);
    $stmt->bindParam(":prediction_result", $data->prediction_result);
    $stmt->bindParam(":confidence_score", $data->confidence_score);

    if($stmt->execute()){
        $prediction_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode(["message" => "Prediction saved.", "id" => $prediction_id]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to save prediction."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
