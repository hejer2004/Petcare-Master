<?php

// CORS & content headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


require_once 'connection.php';

try {
    // Préparer et exécuter la requête
    $stmt = $conn->prepare("SELECT code_espece, libelle FROM espece");
    $stmt->execute();
    
    // Récupérer toutes les espèces
    $especes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $especes
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données : " . $e->getMessage()
    ]);
}
?>
