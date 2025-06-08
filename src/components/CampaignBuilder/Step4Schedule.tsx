
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const boostOptions = [
  {
    id: "echoClone",
    name: "Echo Clone Generator",
    description: "Creates viral content variants with optimized captions",
    impact: "+45% reach",
    cost: "$25",
    icon: "🔄"
  },
  {
    id: "commentSeeding",
    name: "Comment Seeding",
    description: "Authentic engagement boost with strategic comments",
    impact: "+30% engagement", 
    cost: "$15",
    icon: "💬"
  }
];

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵", enabled: true },
  { id: "instagram", name: "Instagram Reels", icon: "📸", enabled: true },
  { id: "youtube", name: "YouTube Shorts", icon: "📺", enabled: false, comingSoon: true },
];

interface Step4ScheduleProps {
  boosts: {
    echoClone: boolean;
    commentSeeding: boolean;
  };
  onBoostToggle: (boostId: string, enabled: boolean) => void;
  onNext: () => void;
}

const Step4Schedule = ({ boosts, onBoostToggle, onNext }: Step4ScheduleProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["tiktok", "instagram"]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { toast } = useToast();

  const togglePlatform = (platformId: string) => {
    if (platforms.find(p => p.id === platformId)?.comingSoon) {
      toast({
        title: "Coming Soon",
        description: "This platform will be available in the next update",
      });
      return;
    }

    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Schedule Required",
        description: "Please set a launch date and time to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform Required", 
        description: "Please select at least one platform to continue",
        variant: "destructive",
      });
      return;
    }
    
    onNext();
  };

  // Generate time slots for the next 7 days
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Schedule & Boost Options
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Configure your launch timing and enhance performance with AI-powered boosts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Target Platforms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-50'
                    : platform.comingSoon
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => togglePlatform(platform.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h4 className="font-medium">{platform.name}</h4>
                    {platform.comingSoon && (
                      <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                    )}
                  </div>
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <Badge className="bg-blue-500 text-white">✓</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Launch Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Launch Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Launch Time (EST)
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time...</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {selectedDate && selectedTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-800 mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Scheduled Launch</span>
                </div>
                <p className="text-sm text-green-700">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {selectedTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Boost Options */}
      <Card>
        <CardHeader>
          <CardTitle>AI Boost Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {boostOptions.map((boost) => (
              <div
                key={boost.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  boosts?.[boost.id as keyof typeof boosts]
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{boost.icon}</span>
                    <h4 className="font-semibold text-lg">{boost.name}</h4>
                  </div>
                  <Switch
                    checked={boosts?.[boost.id as keyof typeof boosts] || false}
                    onCheckedChange={(checked) => onBoostToggle(boost.id, checked)}
                  />
                </div>
                <p className="text-gray-600 mb-4">{boost.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-500/10 text-green-700 border-green-200">
                    {boost.impact}
                  </Badge>
                  <span className="font-bold text-gray-900">{boost.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" className="px-6 py-2">
          ← Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            selectedDate && selectedTime && selectedPlatforms.length > 0
              ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedDate || !selectedTime || selectedPlatforms.length === 0}
        >
          Continue to Review →
        </Button>
      </div>
    </div>
  );
};

export default Step4Schedule;
