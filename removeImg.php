<?php
$username = test_input($_POST['username']); //사용자 이름
$select = test_input($_POST['sel']); //어디서 지우는지 여부에 따라

$allday = test_input($_POST['allday']);

$removeId = test_input($_POST['removed']);
$removeId = str_replace("_",".",$removeId);
$img = "./reserve/".$username."/".$removeId;
unlink($img); // 이미지 파일 삭제

if($select == 1){ //RESERVATIONS에서 삭제하기
  for($i=1;$i<=$allday; $i++){
    $fname = "./data/".$username."_day".$i."Res.txt";
    if(file_exists($fname)){
      $text = "";
      $userfile = @file($fname);
      for($j=0; $j<count($userfile); $j++){
        if(test_input($userfile[$j]) != $removeId){
          $text .= $userfile[$j];
        }
      } //파일 내용 for

      $file = fopen($fname, "w+") or die("Unable to open");
      fwrite($file, $text);
      fclose($file);
    } //파일 존재 여부
  } //day 별 파일

}
else { //DAY별 여행 계획에서 삭제하기
  $imgIdArr = $_POST['imgIdArr'];
  $day = test_input($_POST['day']);

  $fname = "./data/".$username."_".$day."Res.txt";

  $text = "";
  for($i=0; $i<count($imgIdArr); $i++){
    $imgIdArr[$i] = str_replace("_", ".", $imgIdArr[$i]);
    $text .= $imgIdArr[$i]."\n";
  }

  $userfile = fopen($fname, "w+") or die("Unable");

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
