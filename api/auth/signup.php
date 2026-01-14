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

try {
    include_once '../config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(
        !empty($data->email) &&
        !empty($data->password) &&
        !empty($data->name)
    ){
        // Check if email already exists
        $check_query = "SELECT id FROM users WHERE email = :email";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(":email", $data->email);
        $check_stmt->execute();
    
        if($check_stmt->rowCount() > 0){
            http_response_code(400);
            echo json_encode(["message" => "Email already exists."]);
            ob_end_flush();
            exit();
        }
    
        $query = "INSERT INTO users SET full_name=:name, email=:email, password_hash=:password, phone=:phone, role=:role";
        $stmt = $db->prepare($query);
    
        $data->name = htmlspecialchars(strip_tags($data->name));
        $data->email = htmlspecialchars(strip_tags($data->email));
        $data->phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : null;
        $data->role = isset($data->role) ? htmlspecialchars(strip_tags($data->role)) : 'user';
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":phone", $data->phone);
        $stmt->bindParam(":role", $data->role);
    
        if($stmt->execute()){
            http_response_code(201);
            echo json_encode(["message" => "User created successfully."]);
        } else {
            http_response_code(503);
            $errorInfo = $stmt->errorInfo();
            echo json_encode([
                "message" => "Unable to create user.",
                "error" => $errorInfo[2]
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}

ob_end_flush();
?>
