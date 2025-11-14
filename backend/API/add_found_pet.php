<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

   // Requête prévol (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $description = $_POST['description'] ?? '';
    $date_trouve = $_POST['date_trouve'] ?? '';
    $lieu_trouve = $_POST['lieu_trouve'] ?? '';
    $contact_trouveur = $_POST['contact_trouveur'] ?? '';

    if (!empty($description) && !empty($date_trouve) && !empty($lieu_trouve) && !empty($contact_trouveur)) {
        $image_name = 'default.jpg'; // par défaut

        // Gestion de l'image
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploadsFound/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $fileName = uniqid() . '_' . $_FILES['image']['name'];
            $destPath = $uploadDir . $fileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $image_name = $fileName;
            }
        }

        try {
            $query = "INSERT INTO pet_found (description, date_trouve, lieu_trouve, contact_trouveur, image)
                      VALUES (:description, :date_trouve, :lieu_trouve, :contact_trouveur, :image)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':date_trouve', $date_trouve);
            $stmt->bindParam(':lieu_trouve', $lieu_trouve);
            $stmt->bindParam(':contact_trouveur', $contact_trouveur);
            $stmt->bindParam(':image', $image_name);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Animal trouvé ajouté avec succès."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Échec de l'exécution de la requête."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Erreur PDO : " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Données incomplètes."]);
    }
}
?>