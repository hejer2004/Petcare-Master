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
    if (isset($_GET['id_prop'])) {
        $id_prop = $_GET['id_prop'];
        
        $stmt = $conn->prepare("SELECT * FROM proprietaire WHERE id_prop = :id_prop");
        $stmt->bindParam(':id_prop', $id_prop, PDO::PARAM_INT);
    }
    $stmt->execute();
    
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