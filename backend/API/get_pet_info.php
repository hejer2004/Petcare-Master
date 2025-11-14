<?php
// Initialisation de la réponse
$resultat = ["message" => "", "data" => null];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifie l'ID
$id_animal = isset($_GET['id_animal']) ? intval($_GET['id_animal']) : null;

if (!$id_animal) {
    $resultat["message"] = "ID de l'animal manquant.";
    echo json_encode($resultat);
    exit;
}

// Connexion à la base
require("connection.php");

// Requête principale pour l'animal
$sql = "SELECT a.*, p.nom AS proprio_nom, p.prenom AS proprio_prenom,
               e.libelle AS espece_libelle,
               (SELECT MAX(date) FROM dossier_medical WHERE id_animal = a.id_animal) AS dernier_dossier,
               (SELECT MAX(date) FROM rendez_vous WHERE id_animal = a.id_animal) AS dernier_rdv,
               (SELECT COUNT(*) FROM dossier_medical WHERE vaccin = 1 AND id_animal = a.id_animal) AS est_vaccine
        FROM animal a
        LEFT JOIN proprietaire p ON a.id_prop = p.id_prop
        LEFT JOIN espece e ON a.espece = e.code_espece
        WHERE a.id_animal = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$id_animal]);
$animal = $stmt->fetch(PDO::FETCH_ASSOC);

if ($animal) {
    // Dernier dossier médical
    $sql_dossier = "SELECT id_dossier, description, diagnostique, traitements, medicaments, date, vaccin, type_vaccin 
                    FROM dossier_medical 
                    WHERE id_animal = ? 
                    ORDER BY date DESC 
                    LIMIT 1";

    $stmt_dossier = $conn->prepare($sql_dossier);
    $stmt_dossier->execute([$id_animal]);
    $animal['dernier_dossier_details'] = $stmt_dossier->fetch(PDO::FETCH_ASSOC);

    // Tous les dossiers médicaux
    $sql_all_dossiers = "SELECT id_dossier, description, diagnostique, traitements, medicaments, date, vaccin, type_vaccin 
                         FROM dossier_medical 
                         WHERE id_animal = ? 
                         ORDER BY date DESC";

    $stmt_all_dossiers = $conn->prepare($sql_all_dossiers);
    $stmt_all_dossiers->execute([$id_animal]);
    $animal['dossiers'] = $stmt_all_dossiers->fetchAll(PDO::FETCH_ASSOC);

    $sql_rdv = "SELECT * FROM rendez_vous 
                WHERE id_animal = ? 
                ORDER BY date ASC 
                LIMIT 1";
                
    $stmt_rdv = $conn->prepare($sql_rdv);
    $stmt_rdv->execute([$id_animal]);
    $animal['rendez_vous'] = $stmt_rdv->fetchAll(PDO::FETCH_ASSOC);

    $resultat["message"] = "success";
    $resultat["data"] = $animal;
} else {
    $resultat["message"] = "Animal non trouvé.";
}

// Envoie de la réponse JSON
echo json_encode($resultat);
?>