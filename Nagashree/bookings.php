<?php include "backend/config.php"; ?>

<!DOCTYPE html>
<html>
<head>
<title>Bookings - RentIT Admin</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
margin:0;
font-family:'Segoe UI';
background:#f4f7fb;
}

/* Sidebar */

.sidebar{
position:fixed;
left:0;
top:0;
width:240px;
height:100vh;
background:linear-gradient(180deg,#0d3b66,#1d5bbf);
color:white;
padding:20px;
}

.sidebar h3{
margin-bottom:30px;
}

.sidebar a{
display:block;
color:white;
text-decoration:none;
padding:12px;
border-radius:8px;
margin-bottom:8px;
}

.sidebar a:hover{
background:rgba(255,255,255,0.2);
}

/* Main */

.main{
margin-left:240px;
padding:20px;
}

/* Topbar */

.topbar{
background:white;
padding:15px;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,0.1);
margin-bottom:20px;
}

/* Booking table */

.table-box{
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,0.1);
}

.action-btn{
margin-right:5px;
}

</style>

</head>

<body>

<!-- Sidebar -->

<div class="sidebar">

<h3>RentIT Admin</h3>

<a href="dashboard.html">Dashboard</a>
<a href="products.html">Products</a>
<a href="vendors.html">Vendors</a>
<a href="bookings.php">Bookings</a>
<a href="enquiries.html">Enquiries</a>
<a href="reports.html">Reports</a>
<a href="settings.html">Settings</a>

<a href="login.html" class="btn btn-danger mt-4 w-100">Logout</a>

</div>

<!-- Main Content -->

<div class="main">

<!-- Topbar -->

<div class="topbar d-flex justify-content-between align-items-center">

<h4>Bookings</h4>

<input type="text" id="searchBookings" class="form-control w-25" placeholder="Search bookings..." onkeyup="searchBookings()">

</div>

<!-- Booking Table -->

<div class="table-box">

<h5>Recent Bookings</h5>

<table class="table table-hover mt-3">

<thead class="table-light">

<tr>
<th>Booking ID</th>
<th>Customer</th>
<th>Product</th>
<th>Vendor</th>
<th>Date</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody id="bookingsTable">

<tr>
<td colspan="7" class="text-center">Loading bookings...</td>
</tr>

</tbody>

</table>

</div>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
// Sample data for demo (used when database is not connected)
const sampleBookings = [
    {id: '#B101', customer: 'Rahul Sharma', product: 'DSLR Camera', vendor: 'Camera World', booking_date: '12 Mar 2026', status: 'Completed'},
    {id: '#B102', customer: 'Priya Nair', product: 'Laptop', vendor: 'Tech Rentals', booking_date: '13 Mar 2026', status: 'Pending'},
    {id: '#B103', customer: 'Arjun Reddy', product: 'Sports Bike', vendor: 'Bike Hub', booking_date: '14 Mar 2026', status: 'Cancelled'},
    {id: '#B104', customer: 'Anita Patel', product: 'Headphones', vendor: 'Audio Store', booking_date: '15 Mar 2026', status: 'Completed'},
    {id: '#B105', customer: 'John Smith', product: 'Projector', vendor: 'Event Equip', booking_date: '16 Mar 2026', status: 'Pending'},
    {id: '#B106', customer: 'Sarah Johnson', product: 'Drone', vendor: 'Tech Rentals', booking_date: '17 Mar 2026', status: 'Completed'}
];

// Load bookings on page load
document.addEventListener('DOMContentLoaded', loadBookings);

function loadBookings() {
    fetch('backend/get_bookings.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            displayBookings(data);
        } else {
            // No data from database, use sample data
            displayBookings(sampleBookings);
        }
    })
    .catch(error => {
        console.log('Database not connected, using sample data');
        // Use sample data when database is not available
        displayBookings(sampleBookings);
    });
}

function displayBookings(bookings) {
    let tbody = document.getElementById('bookingsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    bookings.forEach(b => {
        let statusBadge = '';
        if (b.status === 'Completed') statusBadge = '<span class="badge bg-success">Completed</span>';
        else if (b.status === 'Pending') statusBadge = '<span class="badge bg-warning">Pending</span>';
        else if (b.status === 'Cancelled') statusBadge = '<span class="badge bg-danger">Cancelled</span>';
        else statusBadge = '<span class="badge bg-info">' + (b.status || 'Unknown') + '</span>';

        tbody.innerHTML += `
        <tr class="booking-row">
            <td>${b.id || 'N/A'}</td>
            <td>${b.customer || 'N/A'}</td>
            <td>${b.product || 'N/A'}</td>
            <td>${b.vendor || 'N/A'}</td>
            <td>${b.booking_date || 'N/A'}</td>
            <td class="status-cell">${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary action-btn" onclick="viewBooking('${b.id}', '${b.customer}', '${b.product}', '${b.vendor || ''}', '${b.booking_date || ''}', '${b.status}')">View</button>
                <button class="btn btn-sm btn-danger cancel-btn" onclick="cancelBooking(this, '${b.id}')" ${b.status === 'Cancelled' ? 'disabled' : ''}>${b.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}</button>
            </td>
        </tr>`;
    });
}

// View Booking Function
function viewBooking(id, customer, product, vendor, date, status) {
    alert('Booking Details:\n\nID: ' + id + '\nCustomer: ' + customer + '\nProduct: ' + product + '\nVendor: ' + vendor + '\nDate: ' + date + '\nStatus: ' + status);
}

// Cancel Booking Function
function cancelBooking(btn, id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        // Update the UI
        const row = btn.closest('tr');
        const statusCell = row.querySelector('.status-cell');
        statusCell.innerHTML = '<span class="badge bg-danger">Cancelled</span>';
        btn.disabled = true;
        btn.textContent = 'Cancelled';
        alert('Booking ' + id + ' has been cancelled.');
    }
}

// Search Functionality
function searchBookings() {
    const input = document.getElementById('searchBookings');
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('.booking-row');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}
</script>

</body>
</html>

