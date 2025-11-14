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
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = ['id_prop', 'nom', 'espece', 'date_nais', 'sexe'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

try {
    // Insert animal
    $stmt = $conn->prepare("INSERT INTO animal (id_prop, nom, espece, date_nais, sexe, race, couleur,poids, signe, sterilisation) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Set optional fields to empty strings if not provided
    $race = isset($data['race']) ? $data['race'] : '';
    $couleur = isset($data['couleur']) ? $data['couleur'] : '';
    $signe_particulier = isset($data['signe_particulier']) ? $data['signe_particulier'] : '';
    $sterilisation = isset($data['sterilisation']) && $data['sterilisation'] ? 1 : 0;
    $poids = isset($data['poids']) && $data['poids'] ? 1 : 0;
    
    $stmt->execute([
        $data['id_prop'],
        $data['nom'],
        $data['espece'],
        $data['date_nais'],
        $data['sexe'],
        $race,
        $couleur,
        $poids,
        $signe_particulier,
        $sterilisation
    ]);

    echo json_encode(["success" => true, "message" => "Animal added successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>