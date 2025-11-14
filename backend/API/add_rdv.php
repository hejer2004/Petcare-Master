<?php


// CORS & content headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Send a proper 200 OK response
    exit(); // Stop further execution
}

require_once 'connection.php';

// Get raw POST data
$rdata = file_get_contents("php://input");
$data = json_decode($rdata,true);

// Validate required fields
$requiredFields = ['id_animal', 'veterinaire', 'lieux', 'date'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

try {
    // Insert animal
    $stmt = $conn->prepare("INSERT INTO rendez_vous (id_animal, veterinaire, lieux, date) 
                            VALUES (?, ?, ?, ?)");
    
    
    $stmt->execute([
        $data['id_animal'],
        $data['veterinaire'],
        $data['lieux'],
        $data['date'],
    ]);

    echo json_encode(["success" => true, "message" => "rendez vous added successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>