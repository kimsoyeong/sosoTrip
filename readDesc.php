<?php
$username = test_input($_POST['username']); //사용자 이름
$day = test_input($_POST['day']); //일

$fileName = "./data/".$username."_".$day.".txt";
$dest = "";
$desc = "";

if(file_exists($fileName)){
  $userfile = @file($fileName);

  $dest = str_replace("|","",$userfile[0]);
  for($i =1; $i<count($userfile); $i++){
    $desc .= $userfile[$i];
  }
}

$out = array();
array_push($out, $dest);
array_push($out, $desc);

$output = json_encode($out);
echo($output);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
