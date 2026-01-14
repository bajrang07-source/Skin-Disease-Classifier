$corsHeader = @"
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

"@

# List of API files to update
$apiFiles = @(
    "e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\api\appointments\list.php",
    "e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\api\appointments\book.php",
    "e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\api\appointments\update_status.php",
    "e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\api\users\profile.php",
    "e:\XAMPP\htdocs\skin-health-hub-main\skin-health-hub-main\api\users\update_profile.php"
)

foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Check if file already has CORS headers
        if ($content -notmatch "Access-Control-Allow-Origin") {
            # Remove opening PHP tag if exists
            $content = $content -replace '^\s*<\?php\s*', ''
            
            # Add CORS headers at the beginning
            $newContent = $corsHeader + $content
            
            # Write back to file
            Set-Content -Path $file -Value $newContent -NoNewline
            
            Write-Host "Updated: $file"
        } else {
            Write-Host "Skipped (already has CORS): $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "`nDone! All API files updated with CORS headers."
