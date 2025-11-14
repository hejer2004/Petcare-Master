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
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit();
    }

    $id =  intval($data['id']);


    $stmt = $conn->prepare("DELETE FROM pet_perdu WHERE id_animal = :id");

    /*elseif ($type === 'found') {
        $stmt = $conn->prepare("DELETE FROM pet_found WHERE contact_trouveur = :contact");
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Type invalide"]);
        exit();
    }*/
    

     $stmt->bindParam(":id",$id);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "id"=> $id]);
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
