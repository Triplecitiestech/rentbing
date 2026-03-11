-- Add featured flag so admins can control which properties appear on the home page
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured) WHERE featured = true;
