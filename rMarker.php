<?php
$username = test_input($_POST['username']);
$day = test_input($_POST['day']);

$fileName = "./data/".$username."_".$day."map.txt";
if(file_exists($fileName)){
  $userfile = @file($fileName) or die("uu");

  for($i=0;$i<count($userfile);$i++){
    $userfile[$i] = test_input($userfile[$i]);
  }

  $output = json_encode($userfile);
  echo($output);
}
else{
  echo 1;
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
