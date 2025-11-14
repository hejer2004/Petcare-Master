<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

$body = file_get_contents("php://input");
$data = json_decode($body, true);

require("connection.php");

if (!isset($data['id_prop'])) {
    $resultat["message"] = "ID du propriétaire manquant.";
    echo json_encode($resultat);
    exit;
}

$reqsql = "UPDATE proprietaire SET 
    nom = :nom, 
    prenom = :prenom, 
    num_tel = :num_tel, 
    sexe = :sexe, 
    adresse = :adresse, 
    email = :email, 
    mdp = :mdp
WHERE id_prop = :id_prop";

$reqprep = $conn->prepare($reqsql);

$reqprep->bindParam(':nom', $data['nom']);
$reqprep->bindParam(':prenom', $data['prenom']);
$reqprep->bindParam(':num_tel', $data['num_tel']);
$reqprep->bindParam(':sexe', $data['sexe']);
$reqprep->bindParam(':adresse', $data['adresse']);
$reqprep->bindParam(':email', $data['email']);
$reqprep->bindParam(':mdp', $data['mdp']);
$reqprep->bindParam(':id_prop', $data['id_prop'], PDO::PARAM_INT);

if ($reqprep->execute()) {
    if ($reqprep->rowCount() > 0) {
        $resultat["message"] = "success";
    } else {
        $resultat["message"] = "Aucune modification effectuée.";
    }
} else {
    $resultat["message"] = "Erreur lors de l'exécution : " ;
}

echo json_encode($resultat);
?>