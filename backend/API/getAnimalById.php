<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once 'connection.php';

try {
    // Check if id_prop is provided
    if (isset($_GET['id_animal'])) {
        $id_animal = $_GET['id_animal'];
        
        // Prepare and execute query with id_prop filter
        $stmt = $conn->prepare("SELECT  a.*  
                                        FROM animal a
                                        WHERE a.id_animal = :id_animal");
        $stmt->bindParam(':id_animal', $id_animal, PDO::PARAM_INT);
    }
    $stmt->execute();
    
    // Retrieve all animals
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données : " . $e->getMessage()
    ]);
}


?>