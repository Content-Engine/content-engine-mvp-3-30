
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useCampaignBuilder } from "@/hooks/useCampaignBuilder";
import { useAuth } from "@/hooks/useAuth";

// Lazy load step components
import Step1Goal from "@/components/CampaignBuilder/Step1Goal";
import Step2Upload from "@/components/CampaignBuilder/Step2Upload";
import Step3Boost from "@/components/CampaignBuilder/Step3Boost";
import Step4Schedule from "@/components/CampaignBuilder/Step4Schedule";
import Step5Launch from "@/components/CampaignBuilder/Step5Launch";
import CampaignClientLinker from "@/components/campaign/CampaignClientLinker";
import AutoEditorAssignment from "@/components/editor/AutoEditorAssignment";

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const { stepNumber } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { campaignData, updateCampaignData, createCampaign, saveDraft } = useCampaignBuilder();
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
      const campaign = await createCampaign();
      if (campaign) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to launch campaign:', error);
    }
  };

  const handleClientLinked = (clientId: string) => {
    updateCampaignData({ user_id: clientId });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Goal onNext={nextStep} />;
      case 2:
        return (
          <div className="space-y-6">
            <Step2Upload onNext={nextStep} onFilesUploaded={setUploadedFiles} />
            {/* Show client linker for admins and social media managers */}
            {['admin', 'social_media_manager'].includes(userRole || '') && campaignData.id && (
              <CampaignClientLinker 
                campaignId={campaignData.id} 
                onClientLinked={handleClientLinked}
              />
            )}
          </div>
        );
      case 3:
        return <Step3Boost onNext={nextStep} />;
      case 4:
        return <Step4Schedule onNext={nextStep} />;
      case 5:
        return (
          <div className="space-y-6">
            <Step5Launch onLaunch={handleLaunchCampaign} />
            {/* Auto-assign editors when campaign is created */}
            {campaignData.id && uploadedFiles.length > 0 && (
              <AutoEditorAssignment 
                campaignId={campaignData.id}
                contentItems={uploadedFiles}
              />
            )}
          </div>
        );
      default:
        return <Step1Goal onNext={nextStep} />;
    }
  };

  const stepTitles = [
    "Campaign Goal",
    "Upload Content", 
    "Boost Settings",
    "Schedule Posts",
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
                  onClick={() => saveDraft()}
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
