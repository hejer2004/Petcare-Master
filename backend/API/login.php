<?php

// CORS & content headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header("Content-Type: application/json") ;

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connection.php';

// Decode incoming JSON data

$data = json_decode(file_get_contents("php://input"), true);



// Validate inputs
if (empty($data['email']) || empty($data['mdp'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

try {
    // Fetch user from DB
    $stmt = $conn->prepare("SELECT * FROM proprietaire WHERE email = ?");
    $stmt->execute([$data['email']]);

    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check password
        if ($data['mdp']== $user['mdp']) {
            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "user" => [
                    "id_prop" => $user['id_prop'],
                    "nom" => $user['nom'],
                    "prenom" => $user['prenom'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Email not found."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
