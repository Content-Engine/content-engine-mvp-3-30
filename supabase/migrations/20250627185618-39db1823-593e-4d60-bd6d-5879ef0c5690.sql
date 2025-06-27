
-- Enable RLS on campaigns table if not already enabled
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Recreate policies with correct permissions
CREATE POLICY "Users can view their own campaigns" 
ON public.campaigns 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = created_by OR
  auth.uid() IN (
    SELECT user_id FROM campaign_collaborators 
    WHERE campaign_id = campaigns.id
  )
);

CREATE POLICY "Users can create campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

CREATE POLICY "Users can update their own campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid() = created_by OR
  auth.uid() IN (
    SELECT user_id FROM campaign_collaborators 
    WHERE campaign_id = campaigns.id AND role IN ('owner', 'editor')
  )
);

CREATE POLICY "Users can delete their own campaigns" 
ON public.campaigns 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = created_by);

-- Handle scheduled_posts policies
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can create scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can update their own scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can delete their own scheduled posts" ON public.scheduled_posts;

CREATE POLICY "Users can view their own scheduled posts" 
ON public.scheduled_posts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create scheduled posts" 
ON public.scheduled_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled posts" 
ON public.scheduled_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled posts" 
ON public.scheduled_posts 
FOR DELETE 
USING (auth.uid() = user_id);
