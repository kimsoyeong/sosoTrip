<?php
// plan table 출력
$username = test_input($_POST['username']);
$day = test_input($_POST['day']);

for($i=0; $i<$day; $i++){
  $tmp = $i+1;
  echo "<tr class='plan_tr'>
  <td id='"."day".$tmp."'class='day_td'>"."Day".$tmp."</td>";
  $fileName = "./data/".$username."_day".$tmp.".txt";

  if(file_exists($fileName)){
    $file = @file($fileName);
    $arry = explode("|", $file[0]);
    echo "<td class='plan_td'>".$arry[0]."</td>";
  }
  else{
    echo "<td class='plan_td'></td>";
  }
  echo "</tr>";
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
