<?php
// Allow requests from your Angular app
header("Access-Control-Allow-Origin: http://localhost:4200");
// Allow specific request methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific headers to be sent
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Allow credentials
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
include("connection.php"); // Assuming this handles your DB connection

// Get raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_animal'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID de l'animal manquant."
    ]); 
    exit;
}

$id_animal = intval($data['id_animal']);

$query = "DELETE FROM animal WHERE id_animal = ?";
$stmt = $conn->prepare($query);

if ($stmt->execute([$id_animal])) {
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Animal supprimé avec succès."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Aucun animal trouvé avec cet ID."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la suppression."
    ]);
}
?>