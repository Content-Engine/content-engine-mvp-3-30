
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import ProgressBar from '@/components/ProgressBar';
import Layout from '@/components/Layout';

// Import step components
import CampaignBuilderStep1 from '@/pages/CampaignBuilderStep1';
import CampaignBuilderStep2 from '@/pages/CampaignBuilderStep2';
import CampaignBuilderStep3 from '@/pages/CampaignBuilderStep3';
import CampaignBuilderStep4 from '@/pages/CampaignBuilderStep4';
import CampaignBuilderStep5 from '@/pages/CampaignBuilderStep5';

interface CampaignData {
  name: string;
  goal: string;
  contentFiles: File[];
  syndicationTier: string;
  boosts: {
    echoClone: boolean;
    commentSeeding: boolean;
  };
  schedule: {
    startDate: string;
    autoBoost: boolean;
  };
  // Enhanced fields
  echo_boost_platforms: number;
  auto_fill_lookalike: boolean;
  comment_templates: string[];
  platform_targets: string[];
  hashtags_caption: string;
}

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = parseInt(step || '1');
  const { createCampaign } = useCampaignData();

  const [campaignData, setCampaignData] = useState<CampaignData>({
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
    // Enhanced fields
    echo_boost_platforms: 1,
    auto_fill_lookalike: false,
    comment_templates: [],
    platform_targets: [],
    hashtags_caption: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campaignBuilderData');
    if (saved) {
      try {
        setCampaignData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved campaign data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('campaignBuilderData', JSON.stringify(campaignData));
  }, [campaignData]);

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      navigate(`/campaign-builder/step/${currentStep + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      navigate(`/campaign-builder/step/${currentStep - 1}`);
    }
  };

  const handleLaunch = async () => {
    try {
      await createCampaign({
        name: campaignData.name || `Campaign ${new Date().toLocaleDateString()}`,
        goal: campaignData.goal,
        syndication_tier: campaignData.syndicationTier,
        start_date: campaignData.schedule.startDate || new Date().toISOString(),
        status: 'active',
        boost_settings: {
          echo_clone: campaignData.boosts.echoClone,
          comment_seeding: campaignData.boosts.commentSeeding,
          auto_boost: campaignData.schedule.autoBoost,
        },
        echo_boost_platforms: campaignData.echo_boost_platforms,
        auto_fill_lookalike: campaignData.auto_fill_lookalike,
        platform_targets: campaignData.platform_targets,
        hashtags_caption: campaignData.hashtags_caption,
      });

      localStorage.removeItem('campaignBuilderData');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  // Validate step before rendering
  if (isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
    navigate('/campaign-builder/step/1', { replace: true });
    return null;
  }

  const stepProps = {
    campaignData,
    updateCampaignData,
    onNext: handleNext,
    onPrevious: handlePrevious,
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CampaignBuilderStep1 {...stepProps} />;
      case 2:
        return <CampaignBuilderStep2 {...stepProps} />;
      case 3:
        return <CampaignBuilderStep3 {...stepProps} />;
      case 4:
        return <CampaignBuilderStep4 {...stepProps} />;
      case 5:
        return <CampaignBuilderStep5 {...stepProps} onLaunch={handleLaunch} />;
      default:
        return <div className="text-white text-center p-8">Invalid step</div>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={5} />
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-white/60">Step {currentStep} of 5</span>
          
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="glass-button-primary"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              className="glass-button-primary"
            >
              Launch Campaign
            </Button>
          )}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
