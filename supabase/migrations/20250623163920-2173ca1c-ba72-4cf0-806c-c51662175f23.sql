
-- First, let's see what check constraint exists and fix it
-- Check what values are allowed for qc_submissions status
SELECT con.conname, pg_get_constraintdef(con.oid) 
FROM pg_constraint con 
INNER JOIN pg_class rel ON rel.oid = con.conrelid 
WHERE rel.relname = 'qc_submissions' AND con.contype = 'c';

-- Insert test data with only valid status values (pending and approved)
INSERT INTO campaigns (id, name, user_id, created_by, goal, status, syndication_tier) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Summer Music Campaign', (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'awareness', 'active', 'standard'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Viral Video Series', (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'engagement', 'active', 'premium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO content_items (id, campaign_id, file_name, file_url, file_type, thumbnail_url, status) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'summer_vibes_video.mp4', '/placeholder.svg', 'video', '/placeholder.svg', 'pending'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'beach_party_reel.mp4', '/placeholder.svg', 'video', '/placeholder.svg', 'pending'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'viral_dance_trend.mp4', '/placeholder.svg', 'video', '/placeholder.svg', 'approved'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'music_challenge.mp4', '/placeholder.svg', 'video', '/placeholder.svg', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Update qc_submissions constraint to allow rejected status
ALTER TABLE qc_submissions DROP CONSTRAINT IF EXISTS qc_submissions_status_check;
ALTER TABLE qc_submissions ADD CONSTRAINT qc_submissions_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

INSERT INTO qc_submissions (id, content_item_id, submitted_by, status, notes, submitted_at) 
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', (SELECT id FROM auth.users LIMIT 1), 'pending', 'Ready for review', NOW() - INTERVAL '2 hours'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', (SELECT id FROM auth.users LIMIT 1), 'pending', 'High priority content', NOW() - INTERVAL '1 hour'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', (SELECT id FROM auth.users LIMIT 1), 'approved', 'Great content quality', NOW() - INTERVAL '6 hours'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', (SELECT id FROM auth.users LIMIT 1), 'rejected', 'Audio quality needs improvement', NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- Add foreign key constraints for qc_submissions table
ALTER TABLE qc_submissions 
ADD CONSTRAINT fk_qc_submissions_content_item 
FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE;

-- Enable RLS for qc_submissions table
ALTER TABLE qc_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for qc_submissions
CREATE POLICY "Users can view QC submissions" 
ON qc_submissions FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    submitted_by = auth.uid() OR 
    reviewed_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'social_media_manager')
  )
);

CREATE POLICY "Users can create QC submissions" 
ON qc_submissions FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  submitted_by = auth.uid()
);

CREATE POLICY "Reviewers can update QC submissions" 
ON qc_submissions FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'social_media_manager')
  )
);
