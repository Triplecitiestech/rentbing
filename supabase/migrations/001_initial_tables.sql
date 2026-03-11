-- ============================================
-- RentBing Database Schema
-- Hybrid: marketing/listings + maintenance ops + Buildium sync
-- ============================================

-- ============================================
-- 1. PROPERTIES — Rental listings
-- Source of truth: Buildium (synced down)
-- Website can create listings before Buildium link exists
-- ============================================
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
  -- Buildium sync fields
  buildium_property_id INTEGER,
  buildium_unit_id INTEGER,
  buildium_last_synced_at TIMESTAMPTZ,
  --
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. PROPERTY_IMAGES — Photos for listings
-- Source of truth: Website (Supabase Storage)
-- Buildium photos can also be synced in
-- ============================================
CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload', 'buildium')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. INQUIRIES — Rental inquiry form submissions
-- Source of truth: Website (originates here)
-- Future: sync to Buildium as Prospect/Note
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  bedrooms TEXT[] DEFAULT '{}',
  message TEXT,
  -- Buildium sync
  buildium_prospect_id INTEGER,
  synced_to_buildium_at TIMESTAMPTZ,
  --
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. MAINTENANCE_REQUESTS — Submitted on website
-- Source of truth: Website (originates here), then syncs to Buildium
-- Buildium status updates sync back to website
-- Designed for future AI triage/classification
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  -- Submitter info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  unit_number TEXT,
  -- Request details
  category TEXT NOT NULL CHECK (category IN (
    'plumbing', 'electrical', 'hvac', 'appliance',
    'structural', 'pest', 'exterior', 'general', 'other'
  )),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'triaged', 'in_progress', 'waiting_parts',
    'scheduled', 'completed', 'cancelled'
  )),
  -- Photo evidence
  photo_urls JSONB DEFAULT '[]',
  -- AI triage fields (for future use)
  ai_category TEXT,
  ai_priority TEXT,
  ai_summary TEXT,
  ai_triaged_at TIMESTAMPTZ,
  -- Buildium sync
  buildium_task_id INTEGER,
  buildium_last_synced_at TIMESTAMPTZ,
  --
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. BUILDIUM_SYNC_LOG — Audit trail for all syncs
-- Tracks every sync operation for debugging
-- ============================================
CREATE TABLE IF NOT EXISTS buildium_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'property', 'maintenance_request', 'inquiry'
  )),
  entity_id UUID NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('to_buildium', 'from_buildium')),
  buildium_id INTEGER,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'skipped')),
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_buildium_id ON properties(buildium_property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_sort_order ON property_images(property_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_buildium_prospect ON inquiries(buildium_prospect_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_buildium ON maintenance_requests(buildium_task_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_created ON maintenance_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_log_entity ON buildium_sync_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_created ON buildium_sync_log(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildium_sync_log ENABLE ROW LEVEL SECURITY;

-- Public can read properties and images (for the website)
CREATE POLICY "Public can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public can read property images" ON property_images FOR SELECT USING (true);

-- Public can submit inquiries and maintenance requests
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit maintenance requests" ON maintenance_requests FOR INSERT WITH CHECK (true);

-- Public can read their own maintenance request by ID (for status tracking)
CREATE POLICY "Public can read maintenance by id" ON maintenance_requests FOR SELECT USING (true);

-- Service role has full access (API routes, sync jobs, admin)
CREATE POLICY "Service role full access properties" ON properties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access images" ON property_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access maintenance" ON maintenance_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access sync_log" ON buildium_sync_log FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS — auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER maintenance_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
