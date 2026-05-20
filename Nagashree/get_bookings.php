<?php
include "config.php";
$sql="SELECT b.*,v.name vendor FROM bookings b LEFT JOIN vendors v ON v.id=b.vendor_id ORDER BY b.id DESC";
$r=mysqli_query($conn,$sql);
$d=[];
while($row=mysqli_fetch_assoc($r)){$d[]=$row;}
echo json_encode($d);
?>