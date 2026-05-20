enquiry panel -- Create Database
CREATE DATABASE IF NOT EXISTS rentit;
USE rentit;

-- Create vendors table
DROP TABLE IF EXISTS vendors;
CREATE TABLE vendors(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
category VARCHAR(100),
phone VARCHAR(20),
status VARCHAR(20)
);

-- Create bookings table
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings(
id INT AUTO_INCREMENT PRIMARY KEY,
customer VARCHAR(100),
product VARCHAR(100),
vendor_id INT,
booking_date DATE,
status VARCHAR(20)
);

-- Create products table
DROP TABLE IF EXISTS products;
CREATE TABLE products(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
description VARCHAR(500),
price DECIMAL(10,2),
image VARCHAR(255),
status VARCHAR(20)
);

-- Create enquiries table
DROP TABLE IF EXISTS enquiries;
CREATE TABLE enquiries(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
message TEXT,
status VARCHAR(20),
reply TEXT
);

-- Create settings table
DROP TABLE IF EXISTS settings;
CREATE TABLE settings(
id INT AUTO_INCREMENT PRIMARY KEY,
admin_name VARCHAR(100),
email VARCHAR(100),
phone VARCHAR(20),
email_notifications VARCHAR(10),
sms_notifications VARCHAR(10),
theme VARCHAR(20)
);

-- Insert sample vendors (from vendors.html)
INSERT INTO vendors (name, category, phone, status) VALUES 
('John Smith', 'Electronics', '9876543210', 'Active'),
('Sarah Johnson', 'Electronics', '9876543211', 'Active'),
('Mike Williams', 'Vehicles', '9876543212', 'Active'),
('Emily Brown', 'Electronics', '9876543213', 'Active'),
('David Lee', 'Events', '9876543214', 'Active'),
('Lisa Chen', 'Electronics', '9876543215', 'Active'),
('Robert Wilson', 'Events', '9876543216', 'Active'),
('Amy Garcia', 'Vehicles', '9876543217', 'Active');

-- Insert sample bookings (from bookings.php)
INSERT INTO bookings (customer, product, vendor_id, booking_date, status) VALUES 
('Rahul Sharma', 'DSLR Camera', 1, '2026-03-12', 'Completed'),
('Priya Nair', 'Laptop', 2, '2026-03-13', 'Pending'),
('Arjun Reddy', 'Sports Bike', 3, '2026-03-14', 'Cancelled'),
('Anita Patel', 'Headphones', 4, '2026-03-15', 'Completed'),
('John Smith', 'Projector', 5, '2026-03-16', 'Pending'),
('Sarah Johnson', 'Drone', 2, '2026-03-17', 'Completed'),
('Mike Wilson', 'Party Tent', 6, '2026-03-18', 'Pending'),
('Emily Brown', 'Car', 8, '2026-03-19', 'Completed'),
('David Lee', 'Sound System', 7, '2026-03-20', 'Pending'),
('Lisa Chen', 'DSLR Camera', 1, '2026-03-21', 'Completed');

-- Insert sample products (from products.html)
INSERT INTO products (name, description, price, image, status) VALUES 
('DSLR Camera', 'Professional photography camera', 1500.00, 'https://images.unsplash.com/photo-1519183071298-a2962be96a88', 'Available'),
('Headphones', 'Noise cancelling headset', 300.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Available'),
('Laptop', 'High performance laptop', 1200.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'Limited'),
('Sports Bike', 'Premium bike for rent', 2000.00, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', 'Booked'),
('Projector', 'HD projector for presentations', 800.00, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'Available'),
('Drone', 'Professional drone with camera', 2500.00, 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9', 'Available'),
('Party Tent', 'Large tent for events', 1500.00, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d', 'Available'),
('Sound System', 'Professional audio system', 1000.00, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04', 'Limited'),
('Car', 'Sedan car for rent', 3000.00, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', 'Available'),
('Gaming Console', 'PlayStation with games', 500.00, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3', 'Available');

-- Insert sample enquiries (from enquiries.html)
INSERT INTO enquiries (name, email, message, status, reply) VALUES 
('Rahul Sharma', 'rahul@gmail.com', 'Hi, I want to rent a DSLR camera for 3 days. Can you tell me the availability?', 'Pending', NULL),
('Priya Nair', 'priya@gmail.com', 'Is the laptop available for weekly rental? Please share price details.', 'Resolved', 'Yes, laptops are available at Rs.1200/day. Weekly discount available.'),
('Arjun Reddy', 'arjun@gmail.com', 'I want to rent a sports bike this weekend. What documents are required?', 'Pending', NULL),
('Anita Patel', 'anita@gmail.com', 'Do you provide delivery service for rented equipment?', 'Resolved', 'Yes, we provide delivery within 20km at Rs.200.'),
('Vikram Kumar', 'vikram@gmail.com', 'Can I get discount on monthly rental?', 'Pending', NULL),
('Nisha Patel', 'nisha@gmail.com', 'What is the minimum rental period?', 'Resolved', 'Minimum rental period is 1 day.'),
('Raj Menon', 'raj@gmail.com', 'Do you have wireless microphones available?', 'Pending', NULL),
('Kavita Singh', 'kavita@gmail.com', 'Is insurance included in the rental price?', 'Resolved', 'Yes, basic insurance is included.');

-- Insert default settings
INSERT INTO settings (admin_name, email, phone, email_notifications, sms_notifications, theme) VALUES 
('Admin', 'admin@rentit.com', '9876543210', 'enabled', 'enabled', 'Light Mode');

