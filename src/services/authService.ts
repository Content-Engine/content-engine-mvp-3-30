
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/notifications';

export const findUserByEmail = async (email: string): Promise<ProfileData | null> => {
  console.log('🔍 Looking up user by email in profiles...');
  
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.warn('⚠️ Profile lookup error:', profileError);
      return null;
    }

    if (profileData) {
      console.log('👤 Profile lookup result:', profileData);
      return profileData;
    }

    return null;
  } catch (error) {
    console.warn('⚠️ Error in profile lookup:', error);
    return null;
  }
};

export const validateUserExists = async (email: string): Promise<ProfileData> => {
  console.log('🔍 Validating user exists...');
  
  const userProfile = await findUserByEmail(email);
  
  if (!userProfile) {
    console.log('❌ No user found with email:', email);
    throw new Error('User not found with that email address. Make sure they have signed up first.');
  }

  console.log('✅ User validation successful:', userProfile.id);
  return userProfile;
};
