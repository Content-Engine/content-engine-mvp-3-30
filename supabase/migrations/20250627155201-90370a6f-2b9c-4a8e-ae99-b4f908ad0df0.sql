
-- Create content_links table for storing imported content metadata
CREATE TABLE public.content_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  campaign_id UUID REFERENCES campaigns(id),
  original_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  provider_name TEXT,
  duration INTEGER, -- Duration in seconds for video content
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_links
CREATE POLICY "Users can view their own content links" 
  ON public.content_links 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content links" 
  ON public.content_links 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content links" 
  ON public.content_links 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content links" 
  ON public.content_links 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_content_links_user_id ON public.content_links(user_id);
CREATE INDEX idx_content_links_campaign_id ON public.content_links(campaign_id);
