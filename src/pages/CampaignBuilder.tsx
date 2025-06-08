
import { useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useCampaignBuilder } from '@/hooks/useCampaignBuilder';
import ProgressBar from '@/components/ProgressBar';
import Layout from '@/components/Layout';
import { DEV_MODE } from '@/config/dev';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Lazy load step components
const Step1Goal = lazy(() => import('@/pages/CampaignBuilderStep1'));
const Step2Upload = lazy(() => import('@/pages/CampaignBuilderStep2'));
const Step3Syndication = lazy(() => import('@/pages/CampaignBuilderStep3'));
const Step4Boost = lazy(() => import('@/pages/CampaignBuilderStep4'));
const Step5Launch = lazy(() => import('@/pages/CampaignBuilderStep5'));

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { stepNumber } = useParams();
  const { createCampaign } = useCampaignData();
  const { state, updateState, clearState } = useCampaignBuilder();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const initialStep = stepNumber ? parseInt(stepNumber) : 1;
  const [currentStep, setCurrentStep] = useState(Math.max(1, Math.min(5, initialStep)));
  const [isLaunching, setIsLaunching] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(`/campaign-builder/step/${nextStep}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(`/campaign-builder/step/${prevStep}`);
    }
  };

  const handleLaunch = async () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    
    try {
      console.log('Launching campaign with state:', state);
      
      // Link campaign to client (current user)
      const campaignData = {
        name: state.name || `Campaign ${new Date().toLocaleDateString()}`,
        goal: state.goal,
        syndication_tier: state.syndicationTier,
        start_date: state.schedule.startDate || new Date().toISOString(),
        status: 'active',
        boost_settings: {
          echo_clone: state.boosts.echoClone,
          comment_seeding: state.boosts.commentSeeding,
          auto_boost: state.schedule.autoBoost,
        },
        echo_boost_platforms: state.echo_boost_platforms,
        auto_fill_lookalike: state.auto_fill_lookalike,
        platform_targets: state.platform_targets,
        hashtags_caption: state.hashtags_caption,
        // Client linkage
        user_id: user?.id,
        created_by: user?.id,
        // Additional metadata for client tracking
        notes: `Campaign created by client: ${user?.email}`,
      };

      const campaign = await createCampaign(campaignData);
      console.log('Campaign created successfully:', campaign);
      
      toast({
        title: "🚀 Campaign Launched Successfully!",
        description: "Your campaign is now active and will be assigned to our content team.",
      });

      clearState();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create campaign:', error);
      
      let errorMessage = 'Failed to create campaign. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          errorMessage = 'Authentication required. Please log in to create campaigns.';
        } else if (error.message.includes('authenticated')) {
          errorMessage = 'Please log in to create campaigns.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error Creating Campaign",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const renderStepContent = () => {
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );

    const stepProps = {
      campaignData: state,
      updateCampaignData: updateState,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onLaunch: handleLaunch,
    };

    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step1Goal {...stepProps} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step2Upload {...stepProps} />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step3Syndication {...stepProps} />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step4Boost {...stepProps} />
          </Suspense>
        );
      case 5:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step5Launch {...stepProps} />
          </Suspense>
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-text-muted">Invalid step: {currentStep}</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container-narrow spacing-content">
        {/* Dev Mode Debug Panel */}
        {DEV_MODE.DISABLE_AUTH && (
          <div className="card-glass p-4 border-2 border-yellow-500/50 mb-6">
            <h3 className="text-heading-4 text-yellow-400 mb-2">🔧 DEV MODE</h3>
            <div className="text-caption space-y-1">
              <p className="text-text-muted">Step: {currentStep} | Goal: "{state.goal}" | Files: {state.contentFiles.length}</p>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(step => (
                  <Button 
                    key={step}
                    size="sm" 
                    variant="secondary"
                    onClick={() => {
                      setCurrentStep(step);
                      navigate(`/campaign-builder/step/${step}`);
                    }}
                  >
                    Step {step}
                  </Button>
                ))}
              </div>
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
            className="text-text-muted hover:text-text-main"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-body-sm text-text-muted">Step {currentStep} of 5</span>
          
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="btn-primary"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="btn-primary"
            >
              {isLaunching ? 'Launching...' : 'Launch Campaign'}
            </Button>
          )}
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
