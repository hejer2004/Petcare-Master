<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    // Récupérer les animaux perdus
    $lost_pets_query = "
        SELECT pp.*, a.*, e.libelle AS espece_libelle, p.nom AS proprietaire_nom, 
               p.prenom AS proprietaire_prenom, p.email AS proprietaire_email
        FROM pet_perdu pp
        JOIN animal a ON pp.id_animal = a.id_animal
        JOIN espece e ON a.espece = e.code_espece
        JOIN proprietaire p ON a.id_prop = p.id_prop
    ";

    $stmt_lost = $conn->query($lost_pets_query);
    $lost_pets = $stmt_lost->fetchAll(PDO::FETCH_ASSOC);

    // Récupérer les animaux trouvés
    $found_pets_query = "SELECT * FROM pet_found ";
    $stmt_found = $conn->query($found_pets_query);
    $found_pets = $stmt_found->fetchAll(PDO::FETCH_ASSOC);

    // Réponse JSON
    $response = array(
        "lost_pets" => $lost_pets,
        "found_pets" => $found_pets
    );

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode([
        "error" => "Erreur de requête SQL : " . $e->getMessage()
    ]);
}
?>
