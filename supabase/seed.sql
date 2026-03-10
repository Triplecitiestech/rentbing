-- ============================================
-- RentBing Seed Data
-- Based on existing rentbing.com listings
-- and public listing indexes
-- ============================================

-- Property 1: 132 Washington Street
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  '132 Washington Street',
  'Binghamton',
  'NY',
  '13901',
  'Two Bedroom Apartments',
  'Spacious two-bedroom apartments at 132 Washington Street in Downtown Binghamton. Hardwood floors, exterior deck, and study room. Perfect for Binghamton University students looking for comfortable off-campus housing.',
  '$700-$775 Per Bedroom Plus Utilities',
  2,
  1,
  750,
  'Residential',
  'available'
);

-- Property 2: 139 Washington Street Studio Apartments
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
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
  550,
  'Apartment',
  'available'
);

-- Property 3: 135 Washington Street
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-333333333333',
  '135 Washington Street',
  'Binghamton',
  'NY',
  '13901',
  '135 Washington Street Apartments',
  'Fully furnished 4-bedroom apartments with all utilities included. In-unit laundry, modern kitchen, and secure entry. Great for groups of students.',
  '$775/person/month — All Utilities Included',
  4,
  2,
  NULL,
  'Apartment',
  'available'
);

-- Property 4: 257 Washington Street
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-444444444444',
  '257 Washington Street',
  'Binghamton',
  'NY',
  '13901',
  '257 Washington Street Apartments',
  'Multiple unit types available including studios and one-bedrooms. Modern finishes in a convenient downtown location near Binghamton University.',
  'From $1,525/month',
  1,
  1,
  725,
  'Apartment',
  'available'
);

-- Property 5: 198 Court Street
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-555555555555',
  '198 Court Street',
  'Binghamton',
  'NY',
  '13901',
  '198 Court Street Apartments',
  'Updated 4-bedroom apartment in a brick building with keypad secure entry. Modern interiors, perfect for student groups.',
  '$3,100/month ($775/person)',
  4,
  2,
  1000,
  'Apartment',
  'available'
);

-- Property 6: 101 Court Street
INSERT INTO properties (id, address, city, state, zip, title, description, price, bedrooms, bathrooms, square_feet, property_type, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-666666666666',
  '101 Court Street',
  'Binghamton',
  'NY',
  '13901',
  '101 Court Street Apartments',
  'Large multi-bedroom apartments across 2 floors with high ceilings and exposed brick. Up to 11 bedrooms available, ideal for larger groups.',
  'From $600-$700/person',
  7,
  2,
  2989,
  'Apartment',
  'available'
);

-- ============================================
-- NOTE: Property images
-- Upload photos to Supabase Storage bucket "property-images"
-- then insert rows here:
--
-- INSERT INTO property_images (property_id, image_url, sort_order)
-- VALUES (
--   'a1b2c3d4-e5f6-7890-abcd-111111111111',
--   'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/property-images/132-washington-1.jpg',
--   0
-- );
-- ============================================
