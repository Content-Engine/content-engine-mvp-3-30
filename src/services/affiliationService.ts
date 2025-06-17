
import { supabase } from '@/integrations/supabase/client';
import { validateUserExists } from './authService';

export const checkExistingAffiliation = async (inviterId: string, invitedUserId: string) => {
  const { data: existingAffiliation, error: checkError } = await supabase
    .from('user_affiliations')
    .select('id, status')
    .eq('inviter_id', inviterId)
    .eq('invited_user_id', invitedUserId)
    .maybeSingle();

  if (checkError) {
    console.error('❌ Error checking existing affiliation:', checkError);
  }

  if (existingAffiliation) {
    console.log('⚠️ Existing affiliation found:', existingAffiliation);
    throw new Error(`User has already been invited (status: ${existingAffiliation.status})`);
  }
};

export const createAffiliation = async (inviterId: string, invitedUserId: string) => {
  console.log('🔗 Creating affiliation record...');
  const { data: affiliation, error: affiliationError } = await supabase
    .from('user_affiliations')
    .insert({
      inviter_id: inviterId,
      invited_user_id: invitedUserId,
      status: 'pending'
    })
    .select()
    .single();

  if (affiliationError) {
    console.error('❌ Error creating affiliation:', affiliationError);
    if (affiliationError.code === '23505') {
      throw new Error('This user has already been invited');
    }
    throw affiliationError;
  }

  console.log('✅ Affiliation created successfully:', affiliation);
  return affiliation;
};

export const verifyNotificationCreation = async (invitedUserId: string) => {
  // Wait a moment for the trigger to create the notification
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if notification was created
  const { data: createdNotification, error: notificationCheckError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', invitedUserId)
    .eq('type', 'affiliation_invitation')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (notificationCheckError) {
    console.error('❌ Error checking notification creation:', notificationCheckError);
  } else if (createdNotification) {
    console.log('✅ Notification created successfully:', createdNotification);
  } else {
    console.log('⚠️ No notification found after affiliation creation');
  }
};

export const sendAffiliationInvitation = async (inviterId: string, invitedEmail: string) => {
  console.log('📧 Sending affiliation invitation to:', invitedEmail);
  
  // Validate that the user exists in our profiles table
  const userProfile = await validateUserExists(invitedEmail);

  console.log('✅ Found user:', userProfile.id);

  // Check if invitation already exists
  await checkExistingAffiliation(inviterId, userProfile.id);

  // Create the affiliation record
  const affiliation = await createAffiliation(inviterId, userProfile.id);

  // Verify notification creation
  await verifyNotificationCreation(userProfile.id);

  return affiliation;
};
