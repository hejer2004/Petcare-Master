<?php
// Tableau pour stocker le résultat
$resultat = ["message" => "", "data" => null];

// En-tête JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

// Récupération du body JSON
$body = file_get_contents("php://input");

// Décodage du JSON en tableau associatif
$data = json_decode($body, true);

// Connexion à la base de données
require("connection.php");

// Vérification des champs requis
if (!isset($data['id_animal'])) {
    $resultat["message"] = "ID de l'animal manquant.";
    echo json_encode($resultat);
    exit;
}

// Requête de mise à jour
$reqsql = "UPDATE animal SET 
    espece = :espece, 
    nom = :nom, 
    date_nais = :date_nais, 
    sexe = :sexe, 
    race = :race, 
    couleur = :couleur, 
    signe = :signe, 
    sterilisation = :sterilisation,
    poids = :poids
WHERE id_animal = :id_animal";

$reqprep = $conn->prepare($reqsql);



// Liaison des paramètres avec PDO
$reqprep->bindParam(':espece', $data['espece']);
$reqprep->bindParam(':nom', $data['nom']);
$reqprep->bindParam(':date_nais', $data['date_nais']);
$reqprep->bindParam(':sexe', $data['sexe']);
$reqprep->bindParam(':race', $data['race']);
$reqprep->bindParam(':couleur', $data['couleur']);
$reqprep->bindParam(':signe', $data['signe']);
$reqprep->bindParam(':sterilisation', $data['sterilisation']);
$reqprep->bindParam(':poids', $data['poids']);
$reqprep->bindParam(':id_animal', $data['id_animal'], PDO::PARAM_INT);

// Exécution
if ($reqprep->execute()) {
    if ($reqprep->rowCount() > 0) {
        $resultat["message"] = "success";
    } else {
        $resultat["message"] = "Aucune modification effectuée.";
    }
} else {
    $resultat["message"] = "Erreur lors de l'exécution : " . implode(" ", $reqprep->errorInfo());
}

// Réponse JSON
echo json_encode($resultat);
?>