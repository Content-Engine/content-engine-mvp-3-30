
import { Tables } from '@/integrations/supabase/types';

// Use the Supabase generated type directly
export type Notification = Tables<'notifications'>;

// Define a type for the profile data we're working with
export type ProfileData = {
  id: string;
  email: string;
  full_name?: string | null;
};

// Define a type for the auth user data
export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: any;
};
