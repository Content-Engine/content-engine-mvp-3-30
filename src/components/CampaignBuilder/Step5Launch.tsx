
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Step5LaunchProps {
  campaignName: string;
  startDate: string;
  autoBoost: boolean;
  scheduledStartDate: string;
  scheduledStartTime: string;
  autoStart: boolean;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
  onAutoBoostToggle: (enabled: boolean) => void;
  onScheduledDateChange: (date: string) => void;
  onScheduledTimeChange: (time: string) => void;
  onAutoStartToggle: (enabled: boolean) => void;
  onLaunch: () => void;
  campaignData?: any;
}

const Step5Launch = ({
  campaignName,
  startDate,
  autoBoost,
  scheduledStartDate,
  scheduledStartTime,
  autoStart,
  onNameChange,
  onDateChange,
  onAutoBoostToggle,
  onScheduledDateChange,
  onScheduledTimeChange,
  onAutoStartToggle,
  onLaunch,
  campaignData
}: Step5LaunchProps) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const isFormValid = campaignName.trim() && scheduledStartDate && scheduledStartTime;

  const handleLaunchClick = async () => {
    console.log('🚀 Launch button clicked');
    console.log('Form valid:', isFormValid);
    console.log('Is launching:', isLaunching);
    
    if (!isFormValid || isLaunching) {
      console.log('❌ Cannot launch - form invalid or already launching');
      return;
    }
    
    setIsLaunching(true);
    
    try {
      console.log('🚀 Launching campaign via edge function...');
      
      // Prepare the data for the Make.com webhook with actual file URLs
      const launchData = {
        files: campaignData?.contentFiles?.map((fileData: any, index: number) => {
          console.log(`📋 Processing file ${index + 1}:`, {
            name: fileData.fileName || fileData.file?.name,
            hasFileUrl: !!fileData.fileUrl,
            fileUrl: fileData.fileUrl
          });
          
          return {
            name: fileData.fileName || fileData.file?.name || `file_${index}`,
            url: fileData.fileUrl || '', // Use the Supabase storage URL
            contentType: fileData.fileType || fileData.file?.type || 'application/octet-stream',
            size: fileData.fileSize || fileData.file?.size || 0,
            editorNotes: fileData.editorNotes || '',
            assignedEditor: fileData.assignedEditor || 'unassigned',
            viralityScore: fileData.viralityScore || 1
          };
        }) || [],
        date: scheduledStartDate,
        time: scheduledStartTime,
        goal: campaignData?.goal || 'awareness',
        tier: campaignData?.syndicationTier || 'basic',
        campaignName: campaignName.trim(),
        autoStart: autoStart || false,
        autoBoost: autoBoost || false,
        platforms: campaignData?.selectedPlatforms || [],
        syndicationVolume: campaignData?.syndicationVolume || 1,
        accountType: campaignData?.accountType || 'local',
        localRegion: campaignData?.localRegion || 'Auto-Detect'
      };

      console.log('📦 Sending launch data with file URLs:', {
        filesCount: launchData.files.length,
        filesWithUrls: launchData.files.filter(f => f.url).length,
        sampleFileUrl: launchData.files[0]?.url || 'No files'
      });

      // Call the launch-campaign edge function
      const { data, error } = await supabase.functions.invoke('launch-campaign', {
        body: launchData
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        toast({
          title: "Launch Failed",
          description: `Failed to launch campaign: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Campaign launched successfully:', data);
      
      toast({
        title: "Campaign Launched! 🚀",
        description: "Your campaign has been successfully submitted to Make.com",
      });

      // Call the parent's onLaunch callback
      onLaunch();

    } catch (error) {
      console.error('❌ Launch error:', error);
      toast({
        title: "Launch Failed",
        description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🚀 Schedule & Launch Campaign
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-300 glass-card-strong p-4 inline-block">
          Set your campaign name and launch schedule
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Campaign Details */}
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Zap className="h-5 w-5 mr-2" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Campaign Name *</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter campaign name..."
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Auto-start when scheduled</span>
              <Switch
                checked={autoStart}
                onCheckedChange={onAutoStartToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Enable auto-boost</span>
              <Switch
                checked={autoBoost}
                onCheckedChange={onAutoBoostToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card className="frosted-glass bg-gradient-to-br from-green-500/10 to-emerald-600/20 border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Calendar className="h-5 w-5 mr-2" />
              Launch Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Launch Date *</label>
              <input
                type="date"
                value={scheduledStartDate}
                onChange={(e) => onScheduledDateChange(e.target.value)}
                min={today}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Launch Time *</label>
              <input
                type="time"
                value={scheduledStartTime}
                onChange={(e) => onScheduledTimeChange(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {scheduledStartDate && scheduledStartTime && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center text-green-400 mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Scheduled Launch</span>
                </div>
                <p className="text-sm text-green-300">
                  {new Date(scheduledStartDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {scheduledStartTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Campaign Name: {campaignName || 'Not set'}</p>
              <p>Files: {campaignData?.contentFiles?.length || 0}</p>
              <p>Files with URLs: {campaignData?.contentFiles?.filter((f: any) => f.fileUrl).length || 0}</p>
              <p>Goal: {campaignData?.goal || 'Not set'}</p>
              <p>Date: {scheduledStartDate || 'Not set'}</p>
              <p>Time: {scheduledStartTime || 'Not set'}</p>
              <p>Form Valid: {isFormValid ? 'Yes' : 'No'}</p>
              <p>Is Launching: {isLaunching ? 'Yes' : 'No'}</p>
              {campaignData?.contentFiles?.length > 0 && (
                <div>
                  <p className="font-medium">Sample File URLs:</p>
                  {campaignData.contentFiles.slice(0, 3).map((file: any, i: number) => (
                    <p key={i} className="text-xs truncate">
                      {i + 1}. {file.fileName || file.file?.name}: {file.fileUrl ? '✅ Has URL' : '❌ No URL'}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Launch Button */}
      <div className="text-center">
        <Button
          onClick={handleLaunchClick}
          disabled={!isFormValid || isLaunching}
          size="lg"
          className={`px-12 py-4 text-lg font-bold rounded-2xl transition-all duration-300 ${
            isFormValid && !isLaunching
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl" 
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isLaunching ? "🔄 Launching..." : "🚀 Launch Campaign"}
        </Button>
        {!isFormValid && (
          <p className="text-gray-400 text-sm mt-2">
            Please complete all required fields (*) to launch your campaign
          </p>
        )}
      </div>
    </div>
  );
};

export default Step5Launch;
