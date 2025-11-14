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
    if (isset($_GET['id_prop'])) {
        $id_prop = $_GET['id_prop'];
        
        // Prepare and execute query with id_prop filter
        $stmt = $conn->prepare("SELECT a.id_animal, a.nom, a.race, e.libelle AS espece_libelle 
                                        FROM animal a
                                        JOIN espece e ON a.espece = e.code_espece
                                        WHERE a.id_prop = :id_prop");
        $stmt->bindParam(':id_prop', $id_prop, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    
    // Retrieve all animals
    $animaux = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "data" => $animaux
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données : " . $e->getMessage()
    ]);
}
?>