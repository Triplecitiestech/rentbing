-- ============================================
-- RentBing Database Schema
-- Rental listing website for student housing
-- ============================================

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Binghamton',
  state TEXT NOT NULL DEFAULT 'NY',
  zip TEXT NOT NULL DEFAULT '13901',
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  square_feet INTEGER,
  property_type TEXT NOT NULL DEFAULT 'Apartment',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Inquiries table (contact form submissions)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  bedrooms TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_sort_order ON property_images(property_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access to properties and images
CREATE POLICY "Public can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public can read property images" ON property_images FOR SELECT USING (true);

-- Service role can do everything (for API routes and admin)
CREATE POLICY "Service role manages properties" ON properties FOR ALL
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages images" ON property_images FOR ALL
  USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages inquiries" ON inquiries FOR ALL
  USING (true) WITH CHECK (true);

-- Public can insert inquiries (contact form)
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT
  WITH CHECK (true);
