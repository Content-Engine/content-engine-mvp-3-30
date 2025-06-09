
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Target, Zap, FileText, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CampaignBuilderStep5Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onLaunch: () => void;
}

const CampaignBuilderStep5 = ({ campaignData, updateCampaignData, onLaunch }: CampaignBuilderStep5Props) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");

  const handleScheduleUpdate = () => {
    updateCampaignData({
      schedule: {
        ...campaignData.schedule,
        startDate: selectedDate ? new Date(`${selectedDate}T${selectedTime}`).toISOString() : new Date().toISOString()
      }
    });
  };

  const isFormValid = selectedDate && selectedTime;

  const handleLaunch = () => {
    handleScheduleUpdate();
    onLaunch();
  };

  const getActiveBoosts = () => {
    return Object.entries(campaignData.boosts || {})
      .filter(([_, enabled]) => enabled)
      .map(([boost, _]) => boost);
  };

  const getSyndicationTierInfo = () => {
    const tiers = {
      basic: { name: "Basic Syndication", price: "$49", platforms: 3 },
      pro: { name: "Pro Syndication", price: "$99", platforms: 5 },
      enterprise: { name: "Enterprise Syndication", price: "$199", platforms: 8 }
    };
    return tiers[campaignData.syndicationTier as keyof typeof tiers] || { name: "Not selected", price: "$0", platforms: 0 };
  };

  return (
    <div className="animate-fade-in spacing-content">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="card-glass p-8 inline-block">
          <h2 className="text-display bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">
            Schedule & Launch 🚀
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
        </div>
        <p className="text-body text-text-muted card-glass p-4 inline-block max-w-2xl">
          Review your campaign details and set your launch schedule
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Schedule Settings */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center text-text-main">
              <Calendar className="h-5 w-5 mr-2" />
              Launch Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-text-main text-body-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-primary w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-text-main text-body-sm font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="input-primary w-full"
              />
            </div>
            
            {selectedDate && selectedTime && (
              <div className="card-surface p-4">
                <p className="text-caption text-text-muted mb-1">Scheduled Launch:</p>
                <p className="text-body text-text-main font-medium">
                  {new Date(`${selectedDate}T${selectedTime}`).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Summary */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-text-main">Campaign Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Info */}
            <div className="flex items-center gap-3 p-3 card-surface rounded-lg">
              <User className="h-5 w-5 text-accent" />
              <div>
                <p className="text-caption text-text-muted">Client</p>
                <p className="text-body-sm text-text-main font-medium">{user?.email}</p>
                <p className="text-caption text-text-muted">ID: {user?.id?.slice(0, 8)}...</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goal:
                </span>
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  {campaignData.goal || 'Not set'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Syndication:
                </span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {getSyndicationTierInfo().name}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Files:
                </span>
                <span className="text-body-sm text-text-main font-medium">
                  {campaignData.contentFiles?.length || 0} files
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Platforms:
                </span>
                <span className="text-body-sm text-text-main font-medium">
                  {getSyndicationTierInfo().platforms} platforms
                </span>
              </div>
            </div>

            {/* Active Boosts */}
            {getActiveBoosts().length > 0 && (
              <div>
                <p className="text-body-sm text-text-muted mb-2">Active Boosts:</p>
                <div className="space-y-1">
                  {getActiveBoosts().map((boost) => (
                    <div key={boost} className="status-active w-fit">
                      {boost === 'echoClone' ? 'Echo Clone Generator' : 'Comment Seeding'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Cost */}
            <div className="border-t border-border-color pt-4">
              <div className="flex justify-between items-center">
                <span className="text-body font-medium text-text-main">Estimated Total:</span>
                <span className="text-heading-4 text-accent font-bold">
                  {getSyndicationTierInfo().price}
                  {getActiveBoosts().length > 0 && ' + boosts'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Button */}
      <div className="text-center space-y-4">
        <Button 
          onClick={handleLaunch}
          disabled={!isFormValid}
          size="lg"
          className={isFormValid ? "btn-primary" : "btn-secondary"}
        >
          {isFormValid ? "🚀 Launch Campaign" : "Set schedule to launch"}
        </Button>
        
        {isFormValid && (
          <div className="card-surface p-3 inline-block">
            <p className="text-caption text-green-400">
              ✅ Ready to launch! Your campaign will be created and assigned to editors.
            </p>
          </div>
        )}
      </div>

      {/* Final Notes */}
      <div className="text-center">
        <div className="card-surface p-4 inline-block max-w-md">
          <p className="text-caption text-text-muted">
            💡 After launch, you'll receive updates via email and can track progress in your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep5;
