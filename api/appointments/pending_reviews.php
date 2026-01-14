<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

// Find appointments that are:
// 1. For this user
// 2. Confirmed
// 3. Date is in the past
// 4. NOT in the reviews table
$query = "SELECT a.id, a.doctor_id, a.appointment_date, u.full_name as doctor_name 
          FROM appointments a 
          JOIN users u ON a.doctor_id = u.id 
          WHERE a.user_id = :user_id 
          AND a.status = 'confirmed' 
          AND a.appointment_date < CURDATE() 
          AND a.id NOT IN (SELECT appointment_id FROM reviews WHERE user_id = :user_id)";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $user_id);
$stmt->execute();

$pending = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($pending);
?>
