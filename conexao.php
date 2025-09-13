<?php
$mysqli = new mysqli("localhost", "root", "Freitas.08", "petnet_bd");

if($mysqli->connect_error) {
    die("Falha na conexão: " . $mysqli->connect_error);
}
?>
