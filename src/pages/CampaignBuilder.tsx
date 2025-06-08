
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import ProgressBar from '@/components/ProgressBar';
import Layout from '@/components/Layout';
import { DEV_MODE } from '@/config/dev';

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
  const params = useParams();
  
  // Fix step parameter parsing
  const stepParam = params.step;
  let currentStep = 1;
  
  console.log('=== STEP PARAMETER DEBUG ===');
  console.log('Raw params:', params);
  console.log('Step param from URL:', stepParam);
  console.log('Current pathname:', window.location.pathname);
  
  if (stepParam) {
    const parsed = parseInt(stepParam, 10);
    console.log('Parsed step number:', parsed);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      currentStep = parsed;
      console.log('✅ Valid step set to:', currentStep);
    } else {
      console.log('❌ Invalid step, defaulting to 1');
    }
  } else {
    console.log('❌ No step param found, defaulting to 1');
  }
  
  const { createCampaign } = useCampaignData();

  console.log('=== CAMPAIGN BUILDER MAIN ===');
  console.log('Final currentStep:', currentStep);
  console.log('DEV_MODE active:', DEV_MODE.DISABLE_AUTH);

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
      console.log('✅ Navigation triggered to step', nextStep);
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
      console.log('✅ Previous navigation triggered to step', prevStep);
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

  const stepProps = {
    campaignData,
    updateCampaignData,
    onNext: handleNext,
    onPrevious: handlePrevious,
  };

  const renderStepContent = () => {
    console.log('=== RENDERING STEP CONTENT ===');
    console.log('Rendering step:', currentStep);
    console.log('Step props goal:', stepProps.campaignData.goal);
    
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
        {/* Debug Panel for Dev Mode */}
        {DEV_MODE.DISABLE_AUTH && (
          <div className="glass-card-strong p-4 border-2 border-yellow-500/50">
            <h3 className="text-yellow-400 font-bold mb-2">🔧 DEV MODE DEBUG PANEL</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/80">Current Step: <span className="text-green-400">{currentStep}</span></p>
                <p className="text-white/80">URL Param: <span className="text-blue-400">"{stepParam}"</span></p>
                <p className="text-white/80">Goal: <span className="text-purple-400">"{campaignData.goal || 'none'}"</span></p>
                <p className="text-white/80">Full URL: <span className="text-cyan-400">{window.location.pathname}</span></p>
              </div>
              <div>
                <p className="text-white/80">Can Navigate: <span className="text-green-400">✅ Yes (Dev Mode)</span></p>
                <p className="text-white/80">Files: <span className="text-cyan-400">{campaignData.contentFiles.length}</span></p>
                <p className="text-white/80">Tier: <span className="text-orange-400">"{campaignData.syndicationTier || 'none'}"</span></p>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button 
                size="sm" 
                onClick={() => navigate('/campaign-builder/step/1')}
                className="glass-button-secondary"
              >
                Go to Step 1
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/campaign-builder/step/2')}
                className="glass-button-secondary"
              >
                Go to Step 2
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/campaign-builder/step/3')}
                className="glass-button-secondary"
              >
                Go to Step 3
              </Button>
            </div>
          </div>
        )}
        
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
              Debug: Step {currentStep} | Goal: "{campaignData.goal}" | URL: {window.location.pathname} | Param: "{stepParam}"
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
