<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (isset($_GET['id_prop'])) {
    $id_prop = $_GET['id_prop'];
}

if (!$id_prop) {
    $resultat["message"] = "ID du propriétaire manquant.";
    echo json_encode($resultat);
    exit;
}

// Connexion à la base
require("connection.php");

// Requête principale pour le propriétaire
$sql = "SELECT p.* 
        FROM proprietaire p 
        WHERE p.id_prop = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$id_prop]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Liste des animaux du propriétaire
    $sql_animals = "SELECT a.*, e.libelle AS espece_libelle 
                    FROM animal a 
                    LEFT JOIN espece e ON a.espece = e.code_espece 
                    WHERE a.id_prop = ?";

    $stmt_animals = $conn->prepare($sql_animals);
    $stmt_animals->execute([$id_prop]);
    $user['animals'] = $stmt_animals->fetchAll(PDO::FETCH_ASSOC);

    $resultat["message"] = "success";
    $resultat["data"] = $user;
} else {
    $resultat["message"] = "Propriétaire non trouvé.";
}

// Envoie de la réponse JSON
echo json_encode($resultat);
?>