<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE,POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['contact'],$data['date'])) {
        http_response_code(400);
        echo json_encode(["error" => "email ou date manquant"]);
        exit();
    }

    $contact =  $data['contact'];
    $date =  $data['date'];
    $stmt = $conn->prepare("DELETE FROM pet_found WHERE contact_trouveur = :contact and date_trouve= :date");
    $stmt->bindParam(":date",$date);
     $stmt->bindParam(":contact",$contact);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Échec de la suppression"]);
    }
    exit();

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    exit();
}
