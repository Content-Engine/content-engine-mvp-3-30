
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Rocket } from "lucide-react";

interface Step5LaunchProps {
  campaignName: string;
  startDate: string;
  autoBoost: boolean;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
  onAutoBoostToggle: (enabled: boolean) => void;
  onLaunch: () => void;
}

const Step5Launch = ({ 
  campaignName, 
  startDate, 
  autoBoost, 
  onNameChange, 
  onDateChange, 
  onAutoBoostToggle, 
  onLaunch 
}: Step5LaunchProps) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await onLaunch();
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Schedule & Launch 🚀
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
          Set your campaign schedule and launch
        </p>
      </div>

      {/* Schedule Settings */}
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaign-name" className="text-white/90">
                Campaign Name
              </Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter campaign name..."
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-white/90">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-white/90 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Auto-Boost
                </Label>
                <p className="text-sm text-white/70">
                  Automatically boost high-performing content
                </p>
              </div>
              <Switch
                checked={autoBoost}
                onCheckedChange={onAutoBoostToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Launch Button */}
        <div className="text-center">
          <Button 
            onClick={handleLaunch}
            disabled={isLaunching || !campaignName.trim()}
            size="lg" 
            className="glass-button-primary text-xl px-12 py-6"
          >
            {isLaunching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Launching Campaign...
              </>
            ) : (
              <>
                <Rocket className="h-6 w-6 mr-3" />
                Launch Campaign
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <div className="glass-card-strong p-4 inline-block">
            <p className="text-white/80 font-medium">
              🎯 Your campaign will begin syndication according to your selected tier and boost settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5Launch;
