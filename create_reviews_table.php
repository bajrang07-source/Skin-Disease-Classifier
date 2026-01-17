<?php
include_once 'api/config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        doctor_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id),
        FOREIGN KEY (doctor_id) REFERENCES users(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )";

    $db->exec($sql);
    echo "Table 'reviews' created successfully.";
} catch(PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>

