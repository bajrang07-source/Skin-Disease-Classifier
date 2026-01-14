<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$doctor_id = isset($_GET['doctor_id']) ? $_GET['doctor_id'] : die();

$query = "SELECT r.id, r.rating, r.review_text, r.created_at, u.full_name as patient_name, a.appointment_date 
          FROM reviews r 
          JOIN users u ON r.user_id = u.id 
          LEFT JOIN appointments a ON r.appointment_id = a.id
          WHERE r.doctor_id = :doctor_id 
          ORDER BY r.created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":doctor_id", $doctor_id);
$stmt->execute();

$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reviews);
?>
