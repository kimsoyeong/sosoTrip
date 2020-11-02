<?php
$username = test_input($_POST['username']);
$day = test_input($_POST['day']);
$fileName = test_input($_POST['fileName'])."\n";

$fname = "./data/".$username."_".$day."Res.txt";

$userfile = fopen($fname, "a+") or die("Unable");

fwrite($userfile, $fileName);
fclose($userfile);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
