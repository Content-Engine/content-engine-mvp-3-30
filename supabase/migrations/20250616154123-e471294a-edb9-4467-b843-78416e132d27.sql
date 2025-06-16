
-- Create a notifications table to track invitations and other notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('affiliation_invitation', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert notifications (for system/admin use)
CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create a function to automatically create notification when affiliation is created
CREATE OR REPLACE FUNCTION public.create_affiliation_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inviter_name TEXT;
BEGIN
  -- Get inviter's name from profiles
  SELECT COALESCE(full_name, email) INTO inviter_name
  FROM public.profiles
  WHERE id = NEW.inviter_id;

  -- Create notification for the invited user
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.invited_user_id,
    'affiliation_invitation',
    'Collaboration Invitation',
    'You have been invited to collaborate by ' || COALESCE(inviter_name, 'an admin'),
    jsonb_build_object('affiliation_id', NEW.id, 'inviter_id', NEW.inviter_id)
  );

  RETURN NEW;
END;
$$;

-- Create trigger to automatically create notifications
CREATE TRIGGER on_affiliation_created
  AFTER INSERT ON public.user_affiliations
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION public.create_affiliation_notification();
