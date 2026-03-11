-- RLS setup for PM Registration Portal

-- Ensure RLS is enabled
ALTER TABLE master_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous SELECT on master data
DROP POLICY IF EXISTS "Allow public select" ON master_skills;
CREATE POLICY "Allow public select" ON master_skills FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public select" ON master_categories;
CREATE POLICY "Allow public select" ON master_categories FOR SELECT TO anon USING (true);

-- Allow anonymous INSERT on applications
DROP POLICY IF EXISTS "Allow anonymous insert" ON pm_applications;
CREATE POLICY "Allow anonymous insert" ON pm_applications FOR INSERT TO anon WITH CHECK (true);
