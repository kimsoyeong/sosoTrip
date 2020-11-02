<?php
// selected-link 클래스를 가진 것들을 받아서 서버 txt 파일에 저장
$username = test_input($_POST['username']);
$button = test_input($_POST['button']);
$fileName = "./data/".$username."_cal.txt";

if($button == 1){ //쓰는 경우
  $userfile = fopen($fileName,"w+");

  $calendar = $_POST['calendar'];
  $text = "";
  for($i = 0; $i<count($calendar); $i++){
    $text .= test_input($calendar[$i])."\n";
  }
  fwrite($userfile, $text);
  fclose($userfile);
}
else{ //읽는 경우
  $day = array();

  if(file_exists($fileName)){
    $userfile = @file($fileName);
    for($i = 0; $i<count($userfile); $i++){
      array_push($day, test_input($userfile[$i]));
    }
  }

  $output = json_encode($day);
  echo($output);
}


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
