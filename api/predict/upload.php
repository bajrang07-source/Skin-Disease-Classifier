<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["message" => "No file uploaded"]);
    exit();
}

$target_dir = "../../uploads/images/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$file_extension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
$new_filename = uniqid() . '.' . $file_extension;
$target_file = $target_dir . $new_filename;
$relative_path = "uploads/images/" . $new_filename;

// Check if image file is a actual image or fake image
$check = getimagesize($_FILES["file"]["tmp_name"]);
if($check === false) {
    http_response_code(400);
    echo json_encode(["message" => "File is not an image."]);
    exit();
}

// Check file size (limit to 10MB)
if ($_FILES["file"]["size"] > 10000000) {
    http_response_code(400);
    echo json_encode(["message" => "Sorry, your file is too large."]);
    exit();
}

// Allow certain file formats
if($file_extension != "jpg" && $file_extension != "png" && $file_extension != "jpeg"
&& $file_extension != "gif" ) {
    http_response_code(400);
    echo json_encode(["message" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."]);
    exit();
}

if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    http_response_code(200);
    echo json_encode([
        "message" => "File uploaded successfully",
        "image_path" => $relative_path
    ]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Sorry, there was an error uploading your file."]);
}
?>
