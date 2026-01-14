<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->appointment_id) &&
    !empty($data->doctor_id) &&
    !empty($data->user_id) &&
    !empty($data->rating)
){
    $query = "INSERT INTO reviews SET 
                appointment_id = :appointment_id,
                doctor_id = :doctor_id,
                user_id = :user_id,
                rating = :rating,
                comment = :comment";

    $stmt = $db->prepare($query);

    $data->comment = !empty($data->comment) ? htmlspecialchars(strip_tags($data->comment)) : '';

    $stmt->bindParam(":appointment_id", $data->appointment_id);
    $stmt->bindParam(":doctor_id", $data->doctor_id);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":rating", $data->rating);
    $stmt->bindParam(":comment", $data->comment);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(["message" => "Review submitted successfully."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to submit review."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
