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
  const navigate = useNavigate();

  const isFormValid = selectedDate && selectedTime;

  const handleLaunch = async () => {
    try {
      console.log("📡 Sending files to Make.com...");

      await fetch("https://hook.us2.make.com/kkaffrcwq5ldum892qtasszegim2dmqb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: campaignData.contentFiles || [],
          launchDate: selectedDate,
          launchTime: selectedTime,
        }),
      });

      console.log("✅ Files sent to Make.com");
      navigate("/payment/success"); // Navigate on success
    } catch (error) {
      console.error("❌ Error sending to Make.com", error);
      navigate("/payment/cancel"); // Navigate on failure
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
              <span className="text-foreground/80 text-sm">Boosts:</span>
              <span className="text-foreground text-sm">
                {Object.values(campaignData.boosts || {}).filter(Boolean).length || 0} active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Button */}
      <div className="text-center">
        <Button
          onClick={handleLaunch}
          disabled={!isFormValid}
          size="lg"
          className="glass-button-primary px-12 py-4 text-lg font-bold"
        >
          🚀 Launch Campaign
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


