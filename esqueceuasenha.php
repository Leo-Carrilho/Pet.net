<?php 

  include("conexao.php");

  $erro = array(); // Correção

  if(isset($_POST["ok"])) {

    $email = $mysqli->escape_string($_POST['email']);

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $erro[] = "E-mail inválido.";
    }

    $sql_code = "SELECT senha, email FROM usuario WHERE email = '$email'";
    $sql_query = $mysqli->query($sql_code) or die($mysqli->error);
    $dado = $sql_query->fetch_assoc();
    $total = $sql_query->num_rows;

    if($total == 0)
      $erro[] = "O e-mail informado não existe no banco de dados.";

    if(count($erro) == 0 && $total > 0) {
      $novasenha = substr(md5(time()), 0, 6);
      $nscriptografada = md5(md5($novasenha));
      
      // Simulando envio de e-mail
      echo "<p><strong>Simulando envio de e-mail:</strong> Sua nova senha é: <strong>$novasenha</strong></p>";

      // Atualizando a senha no banco
      $sql_code = "UPDATE usuario SET senha = '$nscriptografada' WHERE email = '$email'";

      // Executa a query e verifica se funcionou
      if ($mysqli->query($sql_code)) {
          $erro[] = "Senha alterada com sucesso!";
      } else {
          $erro[] = "Erro ao atualizar a senha: " . $mysqli->error;
      }

    }
    
  }

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Esqueceu a senha</title>
</head>
<body>
  <?php 
    if(count($erro) > 0) 
      foreach ($erro as $msg) {
        echo "<p>$msg</p>";
      }
  ?>
  <form method="POST" action="">
    <input value="<?php echo isset($_POST['email']); ?>" placeholder="Seu e-mail" name="email" type="text">
    <input name="ok" value="ok" type="submit">
  </form>
</body>
</html>
