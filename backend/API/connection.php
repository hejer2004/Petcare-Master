<?php
# Définition des paramètres de connexion
$servername = "localhost";  //adresse du serveur de la Base de données
$username = "root";    //utilisateur de la Base de données
$password = "";        //mot de passe de l’utilisateur
$base = "petcare3";   //nom de la base de données

# Création de l’objet connexion
try{
    $conn = new PDO("mysql:host=$servername;dbname=$base",$username,$password);
}
catch(Exception $e)
{  echo json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]);
    exit;
}   

?>