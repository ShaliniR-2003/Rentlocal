# RentIT Rental Management System - Complete Setup Guide

## Database Setup (IMPORTANT - Do this first!)

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Click "Start" for Apache
3. Click "Start" for MySQL

### Step 2: Import Database
1. Open browser and go to: http://localhost/phpmyadmin
2. Click "Import" tab at the top
3. Click "Choose File" button
4. Select the file: `database.sql` from `c:\xampp\htdocs\rentit_complete_project\`
5. Scroll down and click "Go" button
6. You should see message "Import has been successfully finished"

### Step 3: Verify Database
1. In phpMyAdmin, click on "rentit" database on the left sidebar
2. You should see 5 tables: "bookings", "vendors", "products", "enquiries", "settings"
3. Click on each table to see sample data

### Step 4: Open Application
1. Open browser and go to: http://localhost/rentit_complete_project/login.html
2. Click Login button (no authentication required)
3. Navigate through all pages

## Features Working with Database:

### Vendors Page (vendors.html)
- Click "+ Add Vendor" button to add new vendor
- Data saves to database
- Shows all vendors from database

### Products Page (products.html)
- Click "+ Add Product" button to add new product
- Data saves to database
- Shows all products from database
- Search functionality works

### Bookings Page (bookings.php)
- View button shows booking details
- Cancel button updates status to "Cancelled"
- Shows all bookings from database

### Enquiries Page (enquiries.html)
- Shows all customer enquiries from database
- Reply button allows responding to enquiries

### Settings Page (settings.html)
- Shows settings from database
- Save Settings button saves to database

## Files Updated:
- database.sql - Added all tables with sample data
- backend/config.php - Database connection
- backend/get_vendors.php - Get vendors from database
- backend/add_vendor.php - Add vendor to database
- backend/get_products.php - Get products from database
- backend/add_product.php - Add product to database
- backend/get_bookings.php - Get bookings from database
- backend/add_booking.php - Add booking to database
- backend/get_enquiries.php - Get enquiries from database
- backend/add_enquiry.php - Add enquiry to database
- backend/get_settings.php - Get settings from database
- backend/save_settings.php - Save settings to database

## Troubleshooting:
- If pages show "Error loading data", make sure XAMPP is running and database is imported
- Clear browser cache if data doesn't update

