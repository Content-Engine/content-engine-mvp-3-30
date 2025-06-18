import { useState, useEffect } from 'react';
import { FileMetadata } from '@/utils/fileUtils';

interface CampaignBuilderState {
  name: string;
  goal: string;
  contentFiles: FileMetadata[];
  syndicationTier: string;
  boosts: {
    echoClone: boolean;
    commentSeeding: boolean;
  };
  schedule: {
    startDate: string;
    autoBoost: boolean;
    scheduledStartDate: string;
    scheduledStartTime: string;
    autoStart: boolean;
  };
  echo_boost_platforms: number;
  auto_fill_lookalike: boolean;
  comment_templates: string[];
  platform_targets: string[];
  hashtags_caption: string;
  syndicationVolume: number;
  selectedPlatforms: string[];
  accountType: string;
  localRegion: string;
  premiumPlatforms: boolean;
  // Fallback values
  campaign_id: string;
  user_id: string;
  debug_mode: boolean;
}

const initialState: CampaignBuilderState = {
  name: '',
  goal: '',
  contentFiles: [],
  syndicationTier: '',
  boosts: {
    echoClone: false,
    commentSeeding: false,
  },
  schedule: {
    startDate: '',
    autoBoost: false,
    scheduledStartDate: '',
    scheduledStartTime: '',
    autoStart: false,
  },
  echo_boost_platforms: 1,
  auto_fill_lookalike: false,
  comment_templates: [],
  platform_targets: [],
  hashtags_caption: '',
  syndicationVolume: 5,
  selectedPlatforms: [],
  accountType: '',
  localRegion: 'Auto-Detect',
  premiumPlatforms: false,
  campaign_id: '',
  user_id: '',
  debug_mode: false,
};

export const useCampaignBuilder = () => {
  const [state, setState] = useState<CampaignBuilderState>(initialState);

  // Generate fallback values if missing
  const generateFallbackValues = () => {
    const timestamp = Date.now();
    return {
      campaign_id: `draft_campaign_${timestamp}`,
      user_id: 'temp_user',
      debug_mode: true
    };
  };

  // Validate and set fallback values if needed
  const validateContext = () => {
    if (!state.campaign_id || !state.user_id) {
      const fallbacks = generateFallbackValues();
      setState(prev => ({ ...prev, ...fallbacks }));
      console.warn('⚠️ Missing campaign or user data. Using fallback values for debugging.');
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campaignBuilderData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setState({ ...parsedData, contentFiles: [] });
      } catch (error) {
        console.error('Failed to parse saved campaign data:', error);
      }
    }
    validateContext();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = { ...state, contentFiles: [] };
    localStorage.setItem('campaignBuilderData', JSON.stringify(dataToSave));
  }, [state]);

  const updateState = (updates: Partial<CampaignBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const clearState = () => {
    setState(initialState);
    localStorage.removeItem('campaignBuilderData');
  };

  return {
    state,
    updateState,
    clearState,
    validateContext,
  };
};
