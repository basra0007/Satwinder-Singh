-- Remove sample employees if they exist
DELETE FROM employees WHERE email IN (
  'john.smith@traditionalkitchen.com',
  'jane.doe@traditionalkitchen.com',
  'bob.wilson@traditionalkitchen.com',
  'alice.brown@traditionalkitchen.com',
  'charlie.davis@traditionalkitchen.com'
);

-- Also remove any other sample employees that might have been added
DELETE FROM employees WHERE name IN (
  'John Smith',
  'Jane Doe',
  'Bob Wilson',
  'Alice Brown',
  'Charlie Davis'
);
