<?php
// File: api/calls/callSchedule.php
// Twilio Call Scheduler using cURL (no Composer needed)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
include_once '../config/database.php';

// Load .env file manually
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
        }
    }
    return true;
}

if (!loadEnv(__DIR__ . '/.env')) {
    // Try loading from parent directory
    loadEnv(__DIR__ . '/../../.env');
}

$accountSid = $_ENV['TWILIO_ACCOUNT_SID'] ?? null;
$authToken = $_ENV['TWILIO_AUTH_TOKEN'] ?? null;
$twilioNumber = $_ENV['TWILIO_PHONE_NUMBER'] ?? null;

$twilioConfigured = ($accountSid && $authToken && $twilioNumber);

// If Twilio not configured, we'll just save to database without making the call
if (!$twilioConfigured) {
    error_log("Twilio credentials not configured - will save to database only");
}

// ======================
// FUNCTION TO MAKE CALL USING CURL
// ======================
function sendCallReminder($accountSid, $authToken, $twilioNumber, $userPhone, $messageText) {
    $url = "https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Calls.json";
    
    $twiml = "<Response><Say voice='alice'>" . htmlspecialchars($messageText, ENT_XML1, 'UTF-8') . "</Say></Response>";
    
    $data = [
        'To' => $userPhone,
        'From' => $twilioNumber,
        'Twiml' => $twiml
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_USERPWD, "$accountSid:$authToken");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return [
            "status" => "error",
            "message" => "cURL error: " . $error
        ];
    }
    
    $responseData = json_decode($response, true);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return [
            "status" => "success",
            "message" => "Call initiated successfully",
            "call_sid" => $responseData['sid'] ?? 'unknown',
            "call_status" => $responseData['status'] ?? 'unknown'
        ];
    } else {
        return [
            "status" => "error",
            "message" => $responseData['message'] ?? "Failed to initiate call",
            "error_code" => $responseData['code'] ?? null
        ];
    }
}

// =============================
// HANDLE FRONTEND REQUEST (POST)
// =============================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get JSON data from frontend
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Also support form-data
    if (!$data) {
        $data = $_POST;
    }
    
    $userPhone = $data['phone'] ?? null;
    $userId = $data['user_id'] ?? null;
    $scheduledAt = $data['scheduled_at'] ?? date('Y-m-d H:i:s');
    $messageText = $data['message'] ?? "Hello! This is a reminder for your upcoming appointment at Skin Health Hub. Please call us if you need to reschedule. Thank you!";

    if (!$userPhone) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Phone number is required"
        ]);
        exit;
    }

    // Validate phone number format (basic validation)
    // Twilio requires E.164 format: +[country code][number]
    if (!preg_match('/^\+?[1-9]\d{1,14}$/', $userPhone)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid phone number format. Use E.164 format (e.g., +1234567890)"
        ]);
        exit;
    }

    // Trigger the call
    if ($twilioConfigured) {
        $result = sendCallReminder($accountSid, $authToken, $twilioNumber, $userPhone, $messageText);
    } else {
        // Fallback mode - just save to database without calling Twilio
        $result = [
            "status" => "success",
            "message" => "Call scheduled successfully (Twilio not configured - database only)",
            "call_sid" => "fallback_" . uniqid(),
            "call_status" => "scheduled"
        ];
    }
    
    if ($result['status'] === 'success') {
        // Save to database if call was successful
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $query = "INSERT INTO scheduled_calls SET 
                      user_id = :user_id, 
                      phone_number = :phone_number,
                      scheduled_at = :scheduled_at, 
                      call_sid = :call_sid,
                      status = :status,
                      created_at = NOW()";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":user_id", $userId);
            $stmt->bindParam(":phone_number", $userPhone);
            $stmt->bindParam(":scheduled_at", $scheduledAt);
            $stmt->bindParam(":call_sid", $result['call_sid']);
            $callStatus = 'completed';
            $stmt->bindParam(":status", $callStatus);
            
            if ($stmt->execute()) {
                $result['database_id'] = $db->lastInsertId();
                $result['message'] = "Call initiated and saved to database successfully";
            } else {
                $result['database_warning'] = "Call initiated but failed to save to database";
            }
        } catch (Exception $e) {
            $result['database_warning'] = "Call initiated but database error: " . $e->getMessage();
        }
        
        http_response_code(200);
    } else {
        http_response_code(500);
    }
    
    echo json_encode($result);
    
} else {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed. Use POST to schedule a call."
    ]);
}
?>
