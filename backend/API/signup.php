<?php

// CORS & content headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Send a proper 200 OK response
    exit(); // Stop further execution
}

require_once 'connection.php';

// Get raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);
// Validate required fields
$requiredFields = ['nom', 'prenom', 'sexe', 'adresse', 'email', 'mdp', 'num_tel'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

try {


    // Check if email already exists
    $checkStmt = $conn->prepare("SELECT id_prop FROM proprietaire WHERE email = ?");
    $checkStmt->execute([$data['email']]);
    if ($checkStmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Email already exists."]);
        exit;
    }

    // Insert user
    
    $stmt = $conn->prepare("INSERT INTO proprietaire (nom, prenom, sexe, adresse, email, mdp, num_tel) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['nom'],
        $data['prenom'],
        $data['sexe'],
        $data['adresse'],
        $data['email'],
        $data['mdp'],
        $data['num_tel']
    ]);

    echo json_encode(["success" => true, "message" => "proprietaire registered successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
