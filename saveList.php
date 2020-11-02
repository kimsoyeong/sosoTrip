<?php
$username = test_input($_POST['username']);
$listadd = test_input($_POST['list']);

$fileName = "./data/".$username."_undone.txt";
$userfile = fopen($fileName, "a+") or die("Unable");

fwrite($userfile, $listadd."\n");
fclose($userfile);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
