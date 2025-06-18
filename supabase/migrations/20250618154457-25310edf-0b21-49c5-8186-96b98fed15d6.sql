
-- Add scheduling columns to the campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS scheduled_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scheduled_start_time TIME,
ADD COLUMN IF NOT EXISTS auto_start BOOLEAN DEFAULT false;

-- Update the scheduled_posts table to better link with campaigns
ALTER TABLE public.scheduled_posts 
ADD COLUMN IF NOT EXISTS campaign_name TEXT,
ADD COLUMN IF NOT EXISTS campaign_scheduled_date TIMESTAMP WITH TIME ZONE;
