
-- Create a security definer function to check campaign collaborators
CREATE OR REPLACE FUNCTION public.is_campaign_collaborator(campaign_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM campaign_collaborators 
    WHERE campaign_id = campaign_uuid 
    AND user_id = user_uuid
  );
$$;

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Create simplified policies without recursion
CREATE POLICY "Users can view their own campaigns" 
ON public.campaigns 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = created_by OR
  public.is_campaign_collaborator(id, auth.uid())
);

CREATE POLICY "Users can create campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid() = created_by OR
  public.is_campaign_collaborator(id, auth.uid())
);

CREATE POLICY "Users can delete their own campaigns" 
ON public.campaigns 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  auth.uid() = created_by
);

-- Enable RLS on campaign_collaborators if not already enabled
ALTER TABLE public.campaign_collaborators ENABLE ROW LEVEL SECURITY;

-- Add simple policies for campaign_collaborators
DROP POLICY IF EXISTS "Users can view campaign collaborators" ON public.campaign_collaborators;
DROP POLICY IF EXISTS "Users can manage campaign collaborators" ON public.campaign_collaborators;

CREATE POLICY "Users can view campaign collaborators" 
ON public.campaign_collaborators 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  added_by = auth.uid()
);

CREATE POLICY "Users can manage campaign collaborators" 
ON public.campaign_collaborators 
FOR ALL 
USING (added_by = auth.uid())
WITH CHECK (added_by = auth.uid());
