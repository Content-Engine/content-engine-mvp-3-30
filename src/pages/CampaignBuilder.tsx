
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useCampaignData } from "@/hooks/useCampaignData";
import { useCampaignBuilder } from "@/hooks/useCampaignBuilder";
import { useAuth } from "@/hooks/useAuth";

// Lazy load step components
import Step1Goal from "@/components/CampaignBuilder/Step1Goal";
import Step2Upload from "@/components/CampaignBuilder/Step2Upload";
import CampaignBuilderStep3 from "@/pages/CampaignBuilderStep3";
import CampaignBuilderStep4 from "@/pages/CampaignBuilderStep4";
import Step4Schedule from "@/components/CampaignBuilder/Step4Schedule";
import Step5Launch from "@/components/CampaignBuilder/Step5Launch";
import CampaignClientLinker from "@/components/campaign/CampaignClientLinker";
import AutoEditorAssignment from "@/components/editor/AutoEditorAssignment";

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { stepNumber } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentCampaignId, setCurrentCampaignId] = useState<string>("");
  
  const { createCampaign } = useCampaignData();
  const { state, updateState } = useCampaignBuilder();
  const { userRole } = useAuth();

  useEffect(() => {
    if (stepNumber) {
      setCurrentStep(parseInt(stepNumber));
    }
  }, [stepNumber]);

  const nextStep = () => {
    const next = Math.min(currentStep + 1, 5);
    setCurrentStep(next);
    navigate(`/campaign-builder/step/${next}`);
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    navigate(`/campaign-builder/step/${prev}`);
  };

  const handleLaunchCampaign = async () => {
    try {
      const campaign = await createCampaign({
        name: state.name,
        goal: state.goal,
        status: 'active',
        syndication_tier: state.syndicationTier,
        boost_settings: state.boosts,
        start_date: state.schedule.startDate,
        scheduled_start_date: state.schedule.scheduledStartDate ? new Date(`${state.schedule.scheduledStartDate}T${state.schedule.scheduledStartTime}`).toISOString() : null,
        scheduled_start_time: state.schedule.scheduledStartTime,
        auto_start: state.schedule.autoStart,
        echo_boost_enabled: state.boosts.echoClone,
        echo_boost_platforms: state.echo_boost_platforms,
        auto_fill_lookalike: state.auto_fill_lookalike,
        platform_targets: state.platform_targets,
        hashtags_caption: state.hashtags_caption,
        syndication_volume: state.syndicationVolume,
        selected_platforms: state.selectedPlatforms,
        account_type: state.accountType,
        local_region: state.localRegion,
        premium_platforms: state.premiumPlatforms
      });
      
      if (campaign) {
        setCurrentCampaignId(campaign.id);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to launch campaign:', error);
    }
  };

  const handleClientLinked = (clientId: string) => {
    console.log('Client linked:', clientId);
  };

  const handleGoalSelect = (goal: string) => {
    updateState({ goal });
  };

  const handleBoostToggle = (boostId: string, enabled: boolean) => {
    updateState({
      boosts: {
        ...state.boosts,
        [boostId]: enabled
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Goal 
            selectedGoal={state.goal}
            onGoalSelect={handleGoalSelect}
            onNext={nextStep} 
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <Step2Upload 
              contentFiles={state.contentFiles}
              onFilesUpdate={(files) => updateState({ contentFiles: files })}
              onNext={nextStep}
              onPrevious={prevStep}
            />
            {['admin', 'social_media_manager'].includes(userRole || '') && currentCampaignId && (
              <CampaignClientLinker 
                campaignId={currentCampaignId} 
                onClientLinked={handleClientLinked}
              />
            )}
          </div>
        );
      case 3:
        return (
          <CampaignBuilderStep3
            campaignData={state}
            updateCampaignData={updateState}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 4:
        return (
          <CampaignBuilderStep4
            campaignData={state}
            updateCampaignData={updateState}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <Step5Launch 
              campaignName={state.name}
              startDate={state.schedule.startDate}
              autoBoost={state.schedule.autoBoost}
              scheduledStartDate={state.schedule.scheduledStartDate}
              scheduledStartTime={state.schedule.scheduledStartTime}
              autoStart={state.schedule.autoStart}
              onNameChange={(name) => updateState({ name })}
              onDateChange={(date) => updateState({ 
                schedule: { ...state.schedule, startDate: date }
              })}
              onAutoBoostToggle={(enabled) => updateState({ 
                schedule: { ...state.schedule, autoBoost: enabled }
              })}
              onScheduledDateChange={(date) => updateState({ 
                schedule: { ...state.schedule, scheduledStartDate: date }
              })}
              onScheduledTimeChange={(time) => updateState({ 
                schedule: { ...state.schedule, scheduledStartTime: time }
              })}
              onAutoStartToggle={(enabled) => updateState({ 
                schedule: { ...state.schedule, autoStart: enabled }
              })}
              onLaunch={handleLaunchCampaign} 
            />
            {currentCampaignId && state.contentFiles.length > 0 && (
              <AutoEditorAssignment 
                campaignId={currentCampaignId}
                contentItems={state.contentFiles.map(f => f.id)}
              />
            )}
          </div>
        );
      default:
        return (
          <Step1Goal 
            selectedGoal={state.goal}
            onGoalSelect={handleGoalSelect}
            onNext={nextStep} 
          />
        );
    }
  };

  const stepTitles = [
    "Campaign Goal",
    "Upload Content", 
    "Syndication Preferences",
    "Platform Selection",
    "Launch Campaign"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {stepTitles[currentStep - 1]}
            </h1>
            
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-400">
              Step {currentStep} of 5
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => console.log('Save draft')}
                  className="text-white hover:bg-white/10"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignBuilder;
