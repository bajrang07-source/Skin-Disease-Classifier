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
if (['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id)) {
    $query = "UPDATE users SET full_name = :full_name, phone = :phone WHERE id = :user_id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":full_name", $data->full_name);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":user_id", $data->user_id);
    
    if ($stmt->execute()) {
        // If doctor, update doctor profile
        if (isset($data->specialization)) {
            $profileQuery = "UPDATE doctor_profiles 
                           SET specialization = :specialization, 
                               experience_years = :experience_years, 
                               bio = :bio 
                           WHERE user_id = :user_id";
            $profileStmt = $db->prepare($profileQuery);
            
            $profileStmt->bindParam(":specialization", $data->specialization);
            $profileStmt->bindParam(":experience_years", $data->experience_years);
            $profileStmt->bindParam(":bio", $data->bio);
            $profileStmt->bindParam(":user_id", $data->user_id);
            
            $profileStmt->execute();
        }
        
        http_response_code(200);
        echo json_encode(["message" => "Profile updated successfully"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update profile"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
