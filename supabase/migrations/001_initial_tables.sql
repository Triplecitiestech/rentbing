-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rental inquiries (from property pages)
CREATE TABLE IF NOT EXISTS rental_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_name TEXT,
  move_in_date DATE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rental applications (multi-step form)
CREATE TABLE IF NOT EXISTS rental_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Step 1: Personal info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  current_address TEXT,
  -- Step 2: Employment
  employer TEXT,
  job_title TEXT,
  monthly_income NUMERIC,
  employment_duration TEXT,
  -- Step 3: Rental history
  previous_landlord_name TEXT,
  previous_landlord_phone TEXT,
  previous_address TEXT,
  reason_for_leaving TEXT,
  -- Step 4: Property preference
  desired_property TEXT,
  desired_move_in DATE,
  lease_term TEXT,
  num_occupants INTEGER DEFAULT 1,
  pets TEXT,
  -- Meta
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewing', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Maintenance requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_address TEXT NOT NULL,
  unit_number TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  description TEXT NOT NULL,
  photo_urls JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON contact_submissions FOR ALL USING (true);
CREATE POLICY "Service role full access" ON rental_inquiries FOR ALL USING (true);
CREATE POLICY "Service role full access" ON rental_applications FOR ALL USING (true);
CREATE POLICY "Service role full access" ON maintenance_requests FOR ALL USING (true);
