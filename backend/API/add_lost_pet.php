<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'connection.php';

$id_animal = $_POST['id_animal'] ?? null;
$date_perte = $_POST['date_perte'] ?? null;
$lieu_perte = $_POST['lieu_perte'] ?? null;

// Gestion de l'image
$imageName = 'default.jpg';

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploadsLost/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $imageName = time() . '_' . basename($_FILES['image']['name']);
    $uploadPath = $uploadDir . $imageName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
        $imageName = 'default.jpg';
    }
}

if (!empty($id_animal) && !empty($date_perte) && !empty($lieu_perte)) {
    try {
        $query = "INSERT INTO pet_perdu (id_animal, date_perte, lieu_perte, image)
                  VALUES (:id_animal, :date_perte, :lieu_perte, :image)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(':id_animal', $id_animal, PDO::PARAM_INT);
        $stmt->bindParam(':date_perte', $date_perte, PDO::PARAM_STR);
        $stmt->bindParam(':lieu_perte', $lieu_perte, PDO::PARAM_STR);
        $stmt->bindParam(':image', $imageName, PDO::PARAM_STR);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Animal perdu ajouté avec succès."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Impossible d'ajouter l'animal perdu."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
}
?>
