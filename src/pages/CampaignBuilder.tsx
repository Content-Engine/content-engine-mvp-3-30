
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

  console.log('=== CAMPAIGN BUILDER MAIN ===');
  console.log('Current step from URL:', step);
  console.log('Parsed currentStep:', currentStep);
  console.log('Current URL pathname:', window.location.pathname);

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
        const parsedData = JSON.parse(saved);
        console.log('Loading saved campaign data:', parsedData);
        setCampaignData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved campaign data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving campaign data to localStorage:', campaignData);
    localStorage.setItem('campaignBuilderData', JSON.stringify(campaignData));
  }, [campaignData]);

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    console.log('=== UPDATE CAMPAIGN DATA ===');
    console.log('Current campaignData:', campaignData);
    console.log('Updates to apply:', updates);
    
    setCampaignData(prev => {
      const newData = { ...prev, ...updates };
      console.log('New campaignData after update:', newData);
      return newData;
    });
  };

  const handleNext = () => {
    console.log('=== HANDLE NEXT ===');
    console.log('Current step:', currentStep);
    console.log('Campaign data:', campaignData);
    
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      const nextUrl = `/campaign-builder/step/${nextStep}`;
      console.log('Navigating to:', nextUrl);
      navigate(nextUrl);
      console.log('✅ Navigation triggered');
    } else {
      console.log('Already at final step');
    }
  };

  const handlePrevious = () => {
    console.log('=== HANDLE PREVIOUS ===');
    console.log('Current step:', currentStep);
    
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      const prevUrl = `/campaign-builder/step/${prevStep}`;
      console.log('Navigating to:', prevUrl);
      navigate(prevUrl);
      console.log('✅ Previous navigation triggered');
    } else {
      console.log('Already at first step');
    }
  };

  const handleLaunch = async () => {
    console.log('=== HANDLE LAUNCH ===');
    console.log('Final campaign data:', campaignData);
    
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
      console.log('✅ Campaign created successfully, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Failed to create campaign:', error);
    }
  };

  // Validate step before rendering - with better error handling
  if (isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
    console.log('Invalid step detected, redirecting to step 1');
    console.log('Invalid step value:', step, 'parsed as:', currentStep);
    navigate('/campaign-builder/step/1', { replace: true });
    return (
      <Layout>
        <div className="text-white text-center p-8">
          <p>Redirecting to step 1...</p>
        </div>
      </Layout>
    );
  }

  const stepProps = {
    campaignData,
    updateCampaignData,
    onNext: handleNext,
    onPrevious: handlePrevious,
  };

  const renderStepContent = () => {
    console.log('=== RENDERING STEP CONTENT ===');
    console.log('Rendering step:', currentStep);
    console.log('Step props:', stepProps);
    
    switch (currentStep) {
      case 1:
        console.log('Rendering Step 1 (Goal Selection)');
        return <CampaignBuilderStep1 {...stepProps} />;
      case 2:
        console.log('Rendering Step 2 (Content Upload)');
        return <CampaignBuilderStep2 {...stepProps} />;
      case 3:
        console.log('Rendering Step 3 (Syndication)');
        return <CampaignBuilderStep3 {...stepProps} />;
      case 4:
        console.log('Rendering Step 4 (Boost Settings)');
        return <CampaignBuilderStep4 {...stepProps} />;
      case 5:
        console.log('Rendering Step 5 (Schedule & Launch)');
        return <CampaignBuilderStep5 {...stepProps} onLaunch={handleLaunch} />;
      default:
        console.log('Invalid step, rendering error');
        return <div className="text-white text-center p-8">Invalid step: {currentStep}</div>;
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

        {/* Debug info */}
        <div className="text-center">
          <div className="glass-card-strong p-3 inline-block">
            <p className="text-white/60 text-xs">
              Debug: Step {currentStep} | Goal: "{campaignData.goal}" | URL: {window.location.pathname}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
