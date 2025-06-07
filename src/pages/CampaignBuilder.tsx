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
}

const CampaignBuilder = () => {
  console.log('=== CampaignBuilder Component Loading ===');
  
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = parseInt(step || '1');
  const { createCampaign } = useCampaignData();

  console.log('=== CampaignBuilder Debug ===');
  console.log('URL step param:', step);
  console.log('Parsed currentStep:', currentStep);
  console.log('Step is valid number:', !isNaN(currentStep));
  console.log('Step in range:', currentStep >= 1 && currentStep <= 5);
  console.log('CampaignBuilderStep1 component:', CampaignBuilderStep1);
  console.log('CampaignBuilderStep2 component:', CampaignBuilderStep2);

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
    console.log('Updating campaign data:', updates);
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      console.log('Navigating to next step:', currentStep + 1);
      navigate(`/campaign-builder/step-${currentStep + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      console.log('Navigating to previous step:', currentStep - 1);
      navigate(`/campaign-builder/step-${currentStep - 1}`);
    }
  };

  const handleLaunch = async () => {
    try {
      console.log('Launching campaign with data:', campaignData);
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
      });

      // Clear saved data
      localStorage.removeItem('campaignBuilderData');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const renderStep = () => {
    console.log('=== Rendering Step ===');
    console.log('Current step to render:', currentStep);
    console.log('About to render step component...');
    
    const stepProps = {
      campaignData,
      updateCampaignData,
      onNext: handleNext,
      onPrevious: handlePrevious,
    };

    try {
      switch (currentStep) {
        case 1:
          console.log('Rendering Step 1 component');
          console.log('Step 1 props:', stepProps);
          const step1Component = <CampaignBuilderStep1 {...stepProps} />;
          console.log('Step 1 component created:', step1Component);
          return step1Component;
        case 2:
          console.log('Rendering Step 2 component');
          return <CampaignBuilderStep2 {...stepProps} />;
        case 3:
          console.log('Rendering Step 3 component');
          return <CampaignBuilderStep3 {...stepProps} />;
        case 4:
          console.log('Rendering Step 4 component');
          return <CampaignBuilderStep4 {...stepProps} />;
        case 5:
          console.log('Rendering Step 5 component');
          return <CampaignBuilderStep5 {...stepProps} onLaunch={handleLaunch} />;
        default:
          console.error('Invalid step in switch:', currentStep);
          return <div className="text-white text-center p-8">Invalid step: {currentStep}</div>;
      }
    } catch (error) {
      console.error('Error rendering step component:', error);
      return <div className="text-white text-center p-8">Error loading step component: {error.message}</div>;
    }
  };

  // Validate step before rendering
  if (isNaN(currentStep) || currentStep < 1 || currentStep > 5) {
    console.log('Invalid step detected, redirecting to step 1');
    navigate('/campaign-builder/step-1', { replace: true });
    return (
      <Layout>
        <div className="text-white text-center p-8">Redirecting to step 1...</div>
      </Layout>
    );
  }

  console.log('=== Rendering Main Component ===');
  console.log('=== Layout Children Rendering ===');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Debug info */}
        <div className="text-white text-center p-4 bg-red-500/20 border border-red-500/50 rounded">
          <p>Debug: Current Step = {currentStep}</p>
          <p>Debug: Step Param = {step}</p>
          <p>Debug: Component is rendering</p>
        </div>

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
        <div className="min-h-[400px] border-2 border-yellow-500 p-4">
          <div className="text-white mb-4">Debug: Step content container</div>
          {(() => {
            console.log('=== About to render step content ===');
            return renderStep();
          })()}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
