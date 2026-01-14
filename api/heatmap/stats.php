<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Mock disease data for different states
// In production, this would query from a database
$diseaseData = [
    "Acne" => [
        "Maharashtra" => 1250,
        "Karnataka" => 980,
        "Tamil Nadu" => 875,
        "Delhi" => 720,
        "Gujarat" => 650,
        "Rajasthan" => 580,
        "West Bengal" => 520,
        "Uttar Pradesh" => 890,
        "Madhya Pradesh" => 450,
        "Kerala" => 620,
        "Punjab" => 380,
        "Haryana" => 410,
        "Bihar" => 520,
        "Andhra Pradesh" => 680,
        "Telangana" => 590,
        "Odisha" => 340,
        "Assam" => 280,
        "Jharkhand" => 310,
        "Chhattisgarh" => 270,
        "Uttarakhand" => 240
    ],
    "Eczema" => [
        "Maharashtra" => 890,
        "Karnataka" => 720,
        "Tamil Nadu" => 650,
        "Delhi" => 580,
        "Gujarat" => 540,
        "Rajasthan" => 420,
        "West Bengal" => 680,
        "Uttar Pradesh" => 750,
        "Madhya Pradesh" => 380,
        "Kerala" => 490,
        "Punjab" => 520,
        "Haryana" => 460,
        "Bihar" => 590,
        "Andhra Pradesh" => 520,
        "Telangana" => 480,
        "Odisha" => 410,
        "Assam" => 350,
        "Jharkhand" => 290,
        "Chhattisgarh" => 310,
        "Uttarakhand" => 280
    ],
    "Psoriasis" => [
        "Maharashtra" => 620,
        "Karnataka" => 540,
        "Tamil Nadu" => 480,
        "Delhi" => 450,
        "Gujarat" => 410,
        "Rajasthan" => 520,
        "West Bengal" => 380,
        "Uttar Pradesh" => 590,
        "Madhya Pradesh" => 340,
        "Kerala" => 360,
        "Punjab" => 480,
        "Haryana" => 420,
        "Bihar" => 410,
        "Andhra Pradesh" => 390,
        "Telangana" => 370,
        "Odisha" => 280,
        "Assam" => 240,
        "Jharkhand" => 260,
        "Chhattisgarh" => 230,
        "Uttarakhand" => 210
    ],
    "Rosacea" => [
        "Maharashtra" => 380,
        "Karnataka" => 340,
        "Tamil Nadu" => 310,
        "Delhi" => 420,
        "Gujarat" => 290,
        "Rajasthan" => 260,
        "West Bengal" => 320,
        "Uttar Pradesh" => 350,
        "Madhya Pradesh" => 240,
        "Kerala" => 280,
        "Punjab" => 310,
        "Haryana" => 290,
        "Bihar" => 270,
        "Andhra Pradesh" => 260,
        "Telangana" => 250,
        "Odisha" => 190,
        "Assam" => 160,
        "Jharkhand" => 180,
        "Chhattisgarh" => 170,
        "Uttarakhand" => 150
    ],
    "Melanoma" => [
        "Maharashtra" => 180,
        "Karnataka" => 160,
        "Tamil Nadu" => 150,
        "Delhi" => 140,
        "Gujarat" => 130,
        "Rajasthan" => 120,
        "West Bengal" => 110,
        "Uttar Pradesh" => 170,
        "Madhya Pradesh" => 95,
        "Kerala" => 125,
        "Punjab" => 105,
        "Haryana" => 115,
        "Bihar" => 100,
        "Andhra Pradesh" => 135,
        "Telangana" => 120,
        "Odisha" => 85,
        "Assam" => 70,
        "Jharkhand" => 75,
        "Chhattisgarh" => 65,
        "Uttarakhand" => 60
    ],
    "Vitiligo" => [
        "Maharashtra" => 520,
        "Karnataka" => 450,
        "Tamil Nadu" => 410,
        "Delhi" => 380,
        "Gujarat" => 490,
        "Rajasthan" => 360,
        "West Bengal" => 430,
        "Uttar Pradesh" => 480,
        "Madhya Pradesh" => 310,
        "Kerala" => 340,
        "Punjab" => 290,
        "Haryana" => 320,
        "Bihar" => 350,
        "Andhra Pradesh" => 380,
        "Telangana" => 360,
        "Odisha" => 270,
        "Assam" => 230,
        "Jharkhand" => 250,
        "Chhattisgarh" => 220,
        "Uttarakhand" => 190
    ],
    "Dermatitis" => [
        "Maharashtra" => 740,
        "Karnataka" => 680,
        "Tamil Nadu" => 620,
        "Delhi" => 590,
        "Gujarat" => 550,
        "Rajasthan" => 480,
        "West Bengal" => 610,
        "Uttar Pradesh" => 690,
        "Madhya Pradesh" => 420,
        "Kerala" => 510,
        "Punjab" => 460,
        "Haryana" => 490,
        "Bihar" => 520,
        "Andhra Pradesh" => 560,
        "Telangana" => 530,
        "Odisha" => 380,
        "Assam" => 320,
        "Jharkhand" => 340,
        "Chhattisgarh" => 310,
        "Uttarakhand" => 270
    ]
];

$disease = isset($_GET['disease']) ? $_GET['disease'] : 'Acne';

if (!isset($diseaseData[$disease])) {
    echo json_encode(["error" => "Disease not found"]);
    exit();
}

$result = [];
foreach ($diseaseData[$disease] as $state => $cases) {
    $result[] = [
        "state" => $state,
        "cases" => $cases
    ];
}

echo json_encode([
    "disease" => $disease,
    "data" => $result,
    "total" => array_sum($diseaseData[$disease]),
    "states_count" => count($diseaseData[$disease])
]);
?>
