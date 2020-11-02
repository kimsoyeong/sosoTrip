<?php
$username = test_input($_POST['username']);
$day = test_input($_POST['day']);

$fname = "./data/".$username."_".$day."Res.txt";

$out = array();
if(file_exists($fname)){
  $userfile = @file($fname);
  for($i = 0; $i<count($userfile); $i++){
    $userfile[$i] = test_input($userfile[$i]);
    array_push($out, $userfile[$i]);
  }
}

$output = json_encode($out);
echo($output);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
