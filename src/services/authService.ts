
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, AuthUser } from '@/types/notifications';

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

export const findUserInAuthSystem = async (email: string): Promise<AuthUser | null> => {
  console.log('🔍 No profile found, checking if user exists in auth system...');
  
  try {
    const { data: authUsersResponse, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      throw new Error('Unable to verify user existence. Please ensure the user has signed up.');
    }

    if (!authUsersResponse || !authUsersResponse.users) {
      console.log('❌ No users data returned from auth system');
      throw new Error('User not found with that email address. Make sure they have signed up first.');
    }

    const matchingUser = (authUsersResponse.users as AuthUser[]).find((u: AuthUser) => u.email === email);
    
    if (!matchingUser) {
      console.log('❌ No user found in auth system with email:', email);
      throw new Error('User not found with that email address. Make sure they have signed up first.');
    }

    console.log('✅ Found user in auth system:', matchingUser.id);
    return matchingUser;
  } catch (error) {
    console.error('❌ Error in auth user lookup:', error);
    throw error;
  }
};

export const createProfileForUser = async (user: AuthUser, email: string): Promise<ProfileData> => {
  const { data: newProfile, error: createProfileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: email,
      full_name: user.user_metadata?.full_name || null
    })
    .select('id, email, full_name')
    .single();

  if (createProfileError) {
    console.error('❌ Error creating profile:', createProfileError);
    // Continue anyway, we have the user ID
    return { 
      id: user.id, 
      email: email,
      full_name: user.user_metadata?.full_name || null
    };
  } else {
    console.log('✅ Created new profile:', newProfile);
    return newProfile;
  }
};
