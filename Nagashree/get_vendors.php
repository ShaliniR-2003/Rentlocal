<?php
include "config.php";
$r=mysqli_query($conn,"SELECT * FROM vendors ORDER BY id DESC");
$d=[];
while($row=mysqli_fetch_assoc($r)){$d[]=$row;}
echo json_encode($d);
?>