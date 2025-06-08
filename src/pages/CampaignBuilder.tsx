
import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useCampaignBuilder } from '@/hooks/useCampaignBuilder';
import ProgressBar from '@/components/ProgressBar';
import Layout from '@/components/Layout';
import { DEV_MODE } from '@/config/dev';

// Lazy load step components
const Step1Goal = lazy(() => import('@/components/CampaignBuilder/Step1Goal'));
const Step2Upload = lazy(() => import('@/components/CampaignBuilder/Step2Upload'));
const Step3Boost = lazy(() => import('@/components/CampaignBuilder/Step3Boost'));
const Step4Schedule = lazy(() => import('@/components/CampaignBuilder/Step4Schedule'));
const Step5Launch = lazy(() => import('@/components/CampaignBuilder/Step5Launch'));

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { createCampaign } = useCampaignData();
  const { state, updateState, clearState } = useCampaignBuilder();
  
  // State-based step management (no URL routing)
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLaunch = async () => {
    try {
      await createCampaign({
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
      });

      clearState();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const renderStepContent = () => {
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );

    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step1Goal
              selectedGoal={state.goal}
              onGoalSelect={(goal) => updateState({ goal })}
              onNext={handleNext}
            />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step2Upload
              contentFiles={state.contentFiles}
              onFilesUpdate={(files) => updateState({ contentFiles: files })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step3Boost
              syndicationTier={state.syndicationTier}
              echoPlatforms={state.echo_boost_platforms}
              autoFillLookalike={state.auto_fill_lookalike}
              commentTemplates={state.comment_templates}
              onTierSelect={(tier) => updateState({ syndicationTier: tier })}
              onEchoPlatformsChange={(platforms) => updateState({ echo_boost_platforms: platforms })}
              onAutoFillToggle={(enabled) => updateState({ auto_fill_lookalike: enabled })}
              onCommentTemplatesChange={(templates) => updateState({ comment_templates: templates })}
              onNext={handleNext}
            />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step4Schedule
              boosts={state.boosts}
              onBoostToggle={(boostId, enabled) => 
                updateState({ 
                  boosts: { ...state.boosts, [boostId]: enabled } 
                })
              }
              onNext={handleNext}
            />
          </Suspense>
        );
      case 5:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Step5Launch
              campaignName={state.name}
              startDate={state.schedule.startDate}
              autoBoost={state.schedule.autoBoost}
              onNameChange={(name) => updateState({ name })}
              onDateChange={(date) => updateState({ schedule: { ...state.schedule, startDate: date } })}
              onAutoBoostToggle={(enabled) => updateState({ schedule: { ...state.schedule, autoBoost: enabled } })}
              onLaunch={handleLaunch}
            />
          </Suspense>
        );
      default:
        return <div className="text-white text-center p-8">Invalid step: {currentStep}</div>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Dev Mode Debug Panel */}
        {DEV_MODE.DISABLE_AUTH && (
          <div className="glass-card-strong p-4 border-2 border-yellow-500/50">
            <h3 className="text-yellow-400 font-bold mb-2">🔧 DEV MODE</h3>
            <div className="text-sm space-y-1">
              <p className="text-white/80">Step: {currentStep} | Goal: "{state.goal}" | Files: {state.contentFiles.length}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(step => (
                  <Button 
                    key={step}
                    size="sm" 
                    onClick={() => setCurrentStep(step)}
                    className="glass-button-secondary"
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
