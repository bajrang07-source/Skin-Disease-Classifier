<?php
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Path to CSV file
$csvFile = '../../data/doctors.csv';

if (!file_exists($csvFile)) {
    echo json_encode(["message" => "CSV file not found"]);
    exit();
}

$file = fopen($csvFile, 'r');
$header = fgetcsv($file); // Skip header row

$inserted = 0;
$skipped = 0;

while (($row = fgetcsv($file)) !== false) {
    $email = $row[0];
    $password = $row[1];
    $full_name = $row[2];
    $phone = $row[3];
    $specialization = $row[4];
    $experience_years = $row[5];
    $bio = $row[6];
    $city = $row[7];
    $consultation_fee = $row[8];
    
    // Check if doctor already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":email", $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $skipped++;
        continue;
    }
    
    // Insert into users table
    $userQuery = "INSERT INTO users (email, password_hash, full_name, phone, role) 
                  VALUES (:email, :password_hash, :full_name, :phone, 'doctor')";
    $userStmt = $db->prepare($userQuery);
    
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $userStmt->bindParam(":email", $email);
    $userStmt->bindParam(":password_hash", $password_hash);
    $userStmt->bindParam(":full_name", $full_name);
    $userStmt->bindParam(":phone", $phone);
    
    if ($userStmt->execute()) {
        $user_id = $db->lastInsertId();
        
        // Insert into doctor_profiles table
        $profileQuery = "INSERT INTO doctor_profiles (user_id, specialization, experience_years, bio, is_verified) 
                        VALUES (:user_id, :specialization, :experience_years, :bio, 1)";
        $profileStmt = $db->prepare($profileQuery);
        
        $profileStmt->bindParam(":user_id", $user_id);
        $profileStmt->bindParam(":specialization", $specialization);
        $profileStmt->bindParam(":experience_years", $experience_years);
        $profileStmt->bindParam(":bio", $bio);
        
        $profileStmt->execute();
        $inserted++;
    }
}

fclose($file);

echo json_encode([
    "message" => "Doctors seeded successfully",
    "inserted" => $inserted,
    "skipped" => $skipped
]);
?>
