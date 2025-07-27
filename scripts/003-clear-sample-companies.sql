-- Remove sample companies if they exist
DELETE FROM companies WHERE name IN (
  'Gourmet Delights Inc.',
  'Fresh Farm Foods',
  'Urban Eats Co.',
  'Healthy Harvest Ltd.',
  'Premium Provisions'
);
