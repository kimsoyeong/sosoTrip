<?php
$username = test_input($_POST['username']);
$listadd = test_input($_POST['list']);
$removeNot = test_input($_POST['removeNot']);

//done으로 이동
if($removeNot == 1){
  // done 리스트에 저장
  $done = "./data/".$username."_done.txt";
  $userfile = fopen($done, "a+");
  fwrite($userfile, $listadd."\n");
  fclose($userfile);

  // undone 리스트에서의 삭제
  $undone = "./data/".$username."_undone.txt";
  $orgfile = @file($undone);
  $text = "";
  for($i=0; $i<count($orgfile); $i++){
    if(test_input($orgfile[$i]) != $listadd){
      $text .= $orgfile[$i];
    }
  }
  $orgfile = fopen($undone, "w+");
  fwrite($orgfile, $text);
  fclose($orgfile);
}
// done에서 완전히 삭제
else{
  // done 리스트에서의 삭제
  $done = "./data/".$username."_done.txt";
  $orgfile = @file($done);

  $text = "";
  for($i=0; $i<count($orgfile); $i++){
    if(test_input($orgfile[$i]) != $listadd){
      $text .= $orgfile[$i];
    }
  }
  $userfile = fopen($done, "w+");
  fwrite($userfile, $text);
  fclose($userfile);
}


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
