<?php
$username = test_input($_POST['username']);
$posArr = $_POST['posArr'];
$day = test_input($_POST['day']);

$fileName = "./data/".$username."_".$day."map.txt";
$userfile = fopen($fileName, "w+");

$text = "";
for($i=0;$i<count($posArr);$i++){
  $text .= $posArr[$i];
}

fwrite($userfile, $text);
fclose($usefile);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
