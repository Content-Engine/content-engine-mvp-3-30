
-- Create enhanced scheduled_posts table with additional fields for autonomous scheduling
ALTER TABLE scheduled_posts 
ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS airtable_record_id TEXT,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_error_message TEXT,
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS template_used TEXT,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending';

-- Create post_templates table for auto-generation
CREATE TABLE IF NOT EXISTS post_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  caption_template TEXT NOT NULL,
  hashtags TEXT,
  post_timing_offset INTEGER DEFAULT 0, -- minutes offset from campaign start
  platforms JSONB DEFAULT '[]'::jsonb,
  media_requirements JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create notification_queue table for managing notifications
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- 'slack', 'email', 'in_app'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create airtable_sync_log table for tracking external syncs
CREATE TABLE IF NOT EXISTS airtable_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type TEXT NOT NULL, -- 'scheduled_post', 'campaign', etc.
  record_id UUID NOT NULL,
  airtable_record_id TEXT,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'synced', 'failed'
  sync_direction TEXT NOT NULL, -- 'to_airtable', 'from_airtable'
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ
);

-- Enable RLS on new tables
ALTER TABLE post_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE airtable_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_templates
CREATE POLICY "Users can view their campaign templates" ON post_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = post_templates.campaign_id 
      AND (campaigns.user_id = auth.uid() OR campaigns.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage their campaign templates" ON post_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = post_templates.campaign_id 
      AND (campaigns.user_id = auth.uid() OR campaigns.created_by = auth.uid())
    )
  );

-- RLS policies for notification_queue
CREATE POLICY "Users can view their notifications" ON notification_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notification_queue
  FOR INSERT WITH CHECK (true);

-- RLS policies for airtable_sync_log
CREATE POLICY "Users can view sync logs for their content" ON airtable_sync_log
  FOR SELECT USING (true); -- Allow viewing for debugging

CREATE POLICY "System can manage sync logs" ON airtable_sync_log
  FOR ALL USING (true);

-- Function to auto-generate posts when campaign is created
CREATE OR REPLACE FUNCTION auto_generate_campaign_posts()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-generate if campaign has auto_start enabled
  IF NEW.auto_start = true AND NEW.scheduled_start_date IS NOT NULL THEN
    -- Insert auto-generated posts based on templates or default schedule
    INSERT INTO scheduled_posts (
      user_id,
      campaign_id,
      platforms,
      caption,
      schedule_time,
      auto_generated,
      post_type,
      processing_status
    )
    SELECT 
      NEW.user_id,
      NEW.id,
      COALESCE(NEW.platforms, '["tiktok", "instagram"]'::jsonb),
      CONCAT('🎵 New content from ', NEW.name, ' campaign! #music #content'),
      NEW.scheduled_start_date + INTERVAL '1 hour' * generate_series(0, 6), -- 7 posts over 7 hours
      true,
      'auto_generated',
      'pending'
    FROM generate_series(0, 6); -- Generate 7 posts
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger Airtable sync on post changes
CREATE OR REPLACE FUNCTION sync_post_to_airtable()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert sync job for Airtable
  INSERT INTO airtable_sync_log (
    record_type,
    record_id,
    sync_direction,
    sync_status
  ) VALUES (
    'scheduled_post',
    COALESCE(NEW.id, OLD.id),
    'to_airtable',
    'pending'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to queue notifications on status changes
CREATE OR REPLACE FUNCTION queue_status_notification()
RETURNS TRIGGER AS $$
DECLARE
  manager_user_id UUID;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Find social media manager for this campaign
    SELECT user_id INTO manager_user_id
    FROM campaigns c
    LEFT JOIN user_roles ur ON ur.user_id = c.user_id
    WHERE c.id = NEW.campaign_id 
    AND ur.role = 'social_media_manager'
    LIMIT 1;
    
    -- Fallback to campaign owner if no manager found
    IF manager_user_id IS NULL THEN
      SELECT user_id INTO manager_user_id
      FROM campaigns
      WHERE id = NEW.campaign_id;
    END IF;
    
    -- Set notification content based on status
    CASE NEW.status
      WHEN 'posted' THEN
        notification_title := 'Post Successfully Published';
        notification_message := 'Post "' || LEFT(NEW.caption, 50) || '..." has been published successfully.';
      WHEN 'failed' THEN
        notification_title := 'Post Failed to Publish';
        notification_message := 'Post "' || LEFT(NEW.caption, 50) || '..." failed to publish. Error: ' || COALESCE(NEW.last_error_message, 'Unknown error');
      WHEN 'scheduled' THEN
        notification_title := 'Post Scheduled';
        notification_message := 'Post "' || LEFT(NEW.caption, 50) || '..." has been scheduled for ' || NEW.schedule_time::TEXT;
      ELSE
        RETURN NEW; -- No notification for other statuses
    END CASE;
    
    -- Queue notifications for multiple channels
    INSERT INTO notification_queue (user_id, notification_type, title, message, data)
    VALUES 
      (manager_user_id, 'in_app', notification_title, notification_message, 
       jsonb_build_object('post_id', NEW.id, 'campaign_id', NEW.campaign_id, 'status', NEW.status)),
      (manager_user_id, 'slack', notification_title, notification_message,
       jsonb_build_object('post_id', NEW.id, 'campaign_id', NEW.campaign_id, 'status', NEW.status));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER trigger_auto_generate_posts
  AFTER INSERT ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_campaign_posts();

CREATE TRIGGER trigger_sync_post_changes
  AFTER INSERT OR UPDATE OR DELETE ON scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION sync_post_to_airtable();

CREATE TRIGGER trigger_post_status_notifications
  AFTER UPDATE ON scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION queue_status_notification();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_auto_generated ON scheduled_posts(auto_generated);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_processing_status ON scheduled_posts(processing_status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled_for ON notification_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_airtable_sync_log_status ON airtable_sync_log(sync_status);
