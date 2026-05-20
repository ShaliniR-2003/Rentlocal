<?php
include "config.php";
$customer=$_POST['customer'];
$product=$_POST['product'];
$vendor=$_POST['vendor'];
$date=$_POST['date'];
$status=$_POST['status'];
$q="INSERT INTO bookings(customer,product,vendor_id,booking_date,status) VALUES('$customer','$product','$vendor','$date','$status')";
echo mysqli_query($conn,$q)?"success":"error";
?>