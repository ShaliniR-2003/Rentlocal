<?php
include "config.php";
$name=$_POST['name'];
$category=$_POST['category'];
$phone=$_POST['phone'];
$status=$_POST['status'];
$q="INSERT INTO vendors(name,category,phone,status) VALUES('$name','$category','$phone','$status')";
echo mysqli_query($conn,$q)?"success":"error";
?>