<?php

// CORS & content headers
header('Access-Control-Allow-Origin: *'); // Allow all origins (use specific origin in production, e.g., 'http://localhost:4200')
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); // Allow these headers
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Send a proper 200 OK response
    exit(); // Stop further execution
}

require_once 'connection.php';

// Get raw POST data
$rdata = file_get_contents("php://input");
$data = json_decode($rdata, true);




$vaccin = isset($data['vaccin']) && $data['vaccin'] ? 1 : 0;

try {
    
    $stmt = $conn->prepare("INSERT INTO dossier_medical (id_animal,description, diagnostique, traitements, medicaments, date, type_vaccin, vaccin) 
                            VALUES (?,?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $data['animal_id'],
        $data['description'],
        $data['diagnostique'],
        $data['traitements'],
        $data['medicaments'],
        $data['date'],
        $data['type_vaccin'],
        $vaccin,
    ]);

    echo json_encode(["success" => true, "message" => "Medical dossier added successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>