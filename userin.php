<?php
$button = test_input($_POST['button']);
$fileName = "./data/users.txt";

if($button == 0){ //로그인
  $username = test_input($_POST['username']);
  $password = test_input($_POST['password']);
  $day = test_input($_POST['day']);

  $file = @file($fileName);
  $log = false;
  for($i=0; $i<count($file); $i++){
    $tmpArr = explode("|", $file[$i]);
    if($tmpArr[0] == $username){
      if(test_input($tmpArr[1]) == $password){
        // 로그인 성공
        $log = true;
        break;
      } //pw
    } //id
  } //for

  if($log == true){
    $userfile = fopen("./data/nowLogin.txt", "w+");

    fwrite($userfile, $username."|".$day);
    fclose($userfile);

    echo "success";
  }
  else{
    echo "fail";
  }
}
else if($button == 2){ //회원가입
  $username = test_input($_POST['username']);
  $password = test_input($_POST['password']);

  $file = @file($fileName);
  $sign = true;
  for($i=0; $i<count($file); $i++){
    $tmpArr = explode("|", $file[$i]);
    if($tmpArr[0] == $username){
      $sign = false;
      break;
    } // id 중복 확인
  }

  if($sign == true){
    $userfile = fopen($fileName, "a+");
    $user = $username."|".$password."\n";
    fwrite($userfile, $user);
    fclose($userfile);

    echo "success";
  }
  else{
    echo "fail";
  }
}
else{ //username확인
  $userfile = @file("./data/nowLogin.txt");

  $out = explode("|", test_input($userfile[0]));

  $output = json_encode($out);
  echo $output;
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
