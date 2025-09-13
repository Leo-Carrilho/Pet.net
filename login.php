<?php
include("conexao.php");

if (!isset($_SESSION)) session_start();

$erro = [];

if (isset($_POST['email']) && !empty($_POST['email'])) {
  $email = $mysqli->escape_string($_POST['email']);
  $senha = md5(md5($_POST['senha']));

  $sql_code = "SELECT codigo, senha, email FROM usuario WHERE email = '$email'";
  $sql_query = $mysqli->query($sql_code) or die($mysqli->error);
  $dado = $sql_query->fetch_assoc();

  if ($sql_query->num_rows === 0) {
    $erro[] = "Este email não pertence a nenhum usuário.";
  } else {
    if ($dado['senha'] === $senha) {
      $_SESSION['usuario'] = $dado['codigo'];
      echo "<script>alert('Login efetuado com sucesso'); location.href='index.html';</script>";
      exit;
    } else {
      $erro[] = "Senha incorreta.";
    }
  }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <?php 
    if (!empty($erro)) {
      foreach ($erro as $msg) {
        echo "<p style='color:red;'>$msg</p>";
      }
    }
  ?>
  <?php include("form-login.php"); ?>
</body>
</html>
