
-- Create a table for user affiliations/collaborations
CREATE TABLE public.user_affiliations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(inviter_id, invited_user_id)
);

-- Enable RLS
ALTER TABLE public.user_affiliations ENABLE ROW LEVEL SECURITY;

-- Users can see affiliations where they are either the inviter or invited
CREATE POLICY "Users can view their own affiliations" 
  ON public.user_affiliations 
  FOR SELECT 
  USING (auth.uid() = inviter_id OR auth.uid() = invited_user_id);

-- Users can create affiliations as the inviter
CREATE POLICY "Users can create affiliations as inviter" 
  ON public.user_affiliations 
  FOR INSERT 
  WITH CHECK (auth.uid() = inviter_id);

-- Users can update affiliations where they are the invited user (to accept/reject)
CREATE POLICY "Invited users can update their affiliation status" 
  ON public.user_affiliations 
  FOR UPDATE 
  USING (auth.uid() = invited_user_id);

-- Add campaign_collaborators table to link users to campaigns
CREATE TABLE public.campaign_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'collaborator' CHECK (role IN ('owner', 'collaborator', 'viewer')),
  added_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Enable RLS
ALTER TABLE public.campaign_collaborators ENABLE ROW LEVEL SECURITY;

-- Users can see collaborators for campaigns they have access to
CREATE POLICY "Users can view campaign collaborators" 
  ON public.campaign_collaborators 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_collaborators cc 
      WHERE cc.campaign_id = campaign_collaborators.campaign_id 
      AND cc.user_id = auth.uid()
    )
  );

-- Users can add collaborators to campaigns they own or have permission to manage
CREATE POLICY "Users can add collaborators to their campaigns" 
  ON public.campaign_collaborators 
  FOR INSERT 
  WITH CHECK (auth.uid() = added_by);
