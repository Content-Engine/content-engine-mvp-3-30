

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CampaignBuilderStep5Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CampaignBuilderStep5 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep5Props) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isFormValid = selectedDate && selectedTime;

  const handleLaunch = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("📡 Sending campaign data to Make.com...");
      console.log("📋 Campaign data:", campaignData);

      // First, let's try a simple JSON approach to see if the webhook receives anything
      const simplifiedPayload = {
        launchDate: selectedDate,
        launchTime: selectedTime,
        campaignGoal: campaignData.goal || '',
        campaignName: campaignData.name || '',
        syndicationTier: campaignData.syndicationTier || '',
        fileCount: campaignData.contentFiles?.length || 0,
        // Convert file metadata to serializable format (without the actual File objects)
        files: campaignData.contentFiles?.map((fileMetadata: any, index: number) => ({
          index: index,
          name: fileMetadata.file?.name || `file_${index}`,
          size: fileMetadata.file?.size || 0,
          type: fileMetadata.file?.type || '',
          contentType: fileMetadata.contentType || '',
          editorNotes: fileMetadata.editorNotes || '',
          assignedEditor: fileMetadata.assignedEditor || '',
          viralityScore: fileMetadata.viralityScore || 0
        })) || [],
        timestamp: new Date().toISOString(),
        source: 'campaign-builder'
      };

      console.log("📦 Sending simplified payload:", simplifiedPayload);

      const response = await fetch("https://tyler-rottmann.app.n8n.cloud/webhook-test/183b4819-77d8-40bb-a593-6cc8740b7337", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simplifiedPayload),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      // Log response text for debugging
      const responseText = await response.text();
      console.log("📡 Response body:", responseText);

      if (response.ok || response.status === 200) {
        console.log("✅ Campaign data successfully sent to Make.com");
        navigate("/payment/success");
      } else {
        console.error("❌ Make.com responded with error:", response.status, response.statusText);
        console.error("❌ Response body:", responseText);
        
        // Still navigate to success for debugging purposes, but log the error
        alert(`Warning: Webhook returned status ${response.status}. Check console for details.`);
        navigate("/payment/cancel");
      }
    } catch (error) {
      console.error("❌ Error sending to Make.com:", error);
      console.error("❌ Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
      navigate("/payment/cancel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent mb-4">
            Schedule & Launch 🚀
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full"></div>
        </div>
        <p className="text-lg text-foreground/90 glass-card-strong p-4 inline-block">
          Set your launch window and finalize your campaign
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Schedule Settings */}
        <Card className="frosted-glass bg-gradient-to-br from-accent/10 to-secondary/20 border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Calendar className="h-5 w-5 mr-2" />
              Launch Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-foreground/90 text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-card/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-foreground/90 text-sm font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-card/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Summary */}
        <Card className="frosted-glass bg-gradient-to-br from-green-500/10 to-emerald-600/20 border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Campaign Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/80 text-sm">Goal:</span>
              <Badge className="bg-accent/20 text-accent">
                {campaignData.goal || 'Not set'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/80 text-sm">Tier:</span>
              <Badge className="bg-blue-500/20 text-blue-200">
                {campaignData.syndicationTier || 'Not selected'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/80 text-sm">Files:</span>
              <span className="text-foreground text-sm">
                {campaignData.contentFiles?.length || 0} uploaded
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/80 text-sm">Boosts:</span>
              <span className="text-foreground text-sm">
                {Object.values(campaignData.boosts || {}).filter(Boolean).length || 0} active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Files to send: {campaignData.contentFiles?.length || 0}</p>
              <p>Campaign goal: {campaignData.goal || 'Not set'}</p>
              <p>Selected date: {selectedDate || 'Not set'}</p>
              <p>Selected time: {selectedTime || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Launch Button */}
      <div className="text-center">
        <Button
          onClick={handleLaunch}
          disabled={!isFormValid || isSubmitting}
          size="lg"
          className="glass-button-primary px-12 py-4 text-lg font-bold"
        >
          {isSubmitting ? "🔄 Launching..." : "🚀 Launch Campaign"}
        </Button>
        {!isFormValid && (
          <p className="text-muted-foreground text-sm mt-2">
            Please set a launch date and time
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignBuilderStep5;

