<?php
$username = test_input($_POST['username']);
$fileName1 = "./data/".$username."_undone.txt";
$fileName2 = "./data/".$username."_done.txt";

$notUI = array();

if(file_exists($fileName1)){
  $userfile = @file($fileName1);
  $arry = array();
  for($i=0; $i<count($userfile); $i++){
    $userfile[$i] = test_input($userfile[$i]);
    array_push($arry, $userfile[$i]);
  }
  array_push($notUI, $arry);
}
else{
  $arry = array();
  array_push($notUI, $arry);
}

if(file_exists($fileName2)){
  $userfile = @file($fileName2);
  $arry = array();
  for($i=0; $i<count($userfile); $i++){
    $userfile[$i] = test_input($userfile[$i]);
    array_push($arry, $userfile[$i]);
  }
  array_push($notUI, $arry);
}
else{
  $arry = array();
  array_push($notUI, $arry);
}

$output = json_encode($notUI);

echo $output;

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
