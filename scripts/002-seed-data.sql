-- Insert sample companies
INSERT INTO companies (name, contact_person, email, phone, address, price_per_item, status) VALUES
('Gourmet Delights Inc.', 'Sarah Johnson', 'sarah@gourmetdelights.com', '+1-555-0123', '123 Culinary Ave, Food City, FC 12345', 15.50, 'active'),
('Fresh Farm Foods', 'Michael Chen', 'michael@freshfarmfoods.com', '+1-555-0456', '456 Organic Street, Green Valley, GV 67890', 12.75, 'active'),
('Urban Eats Co.', 'Emily Rodriguez', 'emily@urbaneats.com', '+1-555-0789', '789 Downtown Blvd, Metro City, MC 54321', 18.25, 'active'),
('Healthy Harvest Ltd.', 'David Kim', 'david@healthyharvest.com', '+1-555-0321', '321 Wellness Way, Health Town, HT 98765', 14.00, 'active'),
('Premium Provisions', 'Lisa Thompson', 'lisa@premiumprovisions.com', '+1-555-0654', '654 Luxury Lane, Elite District, ED 13579', 22.50, 'inactive')
ON CONFLICT DO NOTHING;

-- Insert sample employees
INSERT INTO employees (name, email, phone, role, status, start_date) VALUES
('John Smith', 'john.smith@traditionalkitchen.com', '+1-555-1001', 'admin', 'active', '2023-01-15'),
('Jane Doe', 'jane.doe@traditionalkitchen.com', '+1-555-1002', 'manager', 'active', '2023-02-20'),
('Bob Wilson', 'bob.wilson@traditionalkitchen.com', '+1-555-1003', 'staff', 'active', '2023-03-10'),
('Alice Brown', 'alice.brown@traditionalkitchen.com', '+1-555-1004', 'staff', 'active', '2023-04-05'),
('Charlie Davis', 'charlie.davis@traditionalkitchen.com', '+1-555-1005', 'staff', 'inactive', '2023-05-12')
ON CONFLICT (email) DO NOTHING;
