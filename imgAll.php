<?php
$username = test_input($_POST['username']);
$allday = test_input($_POST['allday']);

$out = array();
for($i=1; $i<=$allday; $i++){
  $fname = "./data/".$username."_day".$i."Res.txt";
  if(file_exists($fname)){
    $userfile = @file($fname);
    for($j = 0; $j<count($userfile); $j++){
      $userfile[$j] = test_input($userfile[$j]);
      array_push($out, $userfile[$j]);
    }
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
