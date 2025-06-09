
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
  };
  echo_boost_platforms: number;
  auto_fill_lookalike: boolean;
  comment_templates: string[];
  platform_targets: string[];
  hashtags_caption: string;
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
  },
  echo_boost_platforms: 1,
  auto_fill_lookalike: false,
  comment_templates: [],
  platform_targets: [],
  hashtags_caption: '',
};

export const useCampaignBuilder = () => {
  const [state, setState] = useState<CampaignBuilderState>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campaignBuilderData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setState(parsedData);
      } catch (error) {
        console.error('Failed to parse saved campaign data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('campaignBuilderData', JSON.stringify(state));
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
  };
};
