-- ============================================
-- RentBing Seed Data
-- Based on existing rentbing.com listings
-- ============================================

-- Property 1: Two Bedroom Apartments
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'Downtown Binghamton',
  'Binghamton',
  'NY',
  '13901',
  'Two Bedroom',
  'Spacious two-bedroom apartments in Downtown Binghamton. Perfect for Binghamton University students looking for comfortable off-campus housing. Conveniently located near campus with easy access to downtown shops and restaurants.',
  '$700-$775 Per Bedroom Plus Utilities',
  2,
  1,
  'Residential',
  'available'
);

-- Property 2: 139 Washington Street Studio Apartments
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  '139 Washington Street',
  'Binghamton',
  'NY',
  '13901',
  '139 Washington Street Apartment Studio Apartments',
  'Studio apartments at 139 Washington Street in Downtown Binghamton. Ideal for graduate students seeking a private, affordable living space near Binghamton University.',
  '$975 Plus Utilities',
  1,
  1,
  'Apartment',
  'available'
);

-- NOTE: Add property images after uploading photos to Supabase Storage
-- Example:
-- INSERT INTO property_images (property_id, image_url, sort_order)
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'https://your-supabase-url.supabase.co/storage/v1/object/public/property-images/two-bedroom-1.jpg', 0);
