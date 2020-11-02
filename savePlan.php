<?php
$username = test_input($_POST['username']); //사용자 이름
$day = test_input($_POST['day']); //일
$dest = test_input($_POST['dest']); //장소
$textArea = test_input($_POST['textarea']); //상세 일정

$fileName = "./data/".$username."_".$day.".txt";
$userfile = fopen($fileName, 'w+') or die("Unable to open");

$arry = array();
array_push($arry, $dest);
array_push($arry, $textArea);
$text = implode("|\n",$arry);

fwrite($userfile, $text);
fclose($userfile);

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
