<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    include_once '../config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo json_encode([
            "status" => "success",
            "message" => "Database connection successful"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database connection failed"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
