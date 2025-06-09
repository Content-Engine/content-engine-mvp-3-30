
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Share2,
  Calendar,
  BarChart3,
  Zap,
  Inbox
} from "lucide-react";
import ContentCalendarView from "./ContentCalendarView";
import IncomingContentView from "./IncomingContentView";

interface SyndicationViewProps {
  currentCampaign: string;
}

const SyndicationView = ({ currentCampaign }: SyndicationViewProps) => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card-bg/50 border-border-color">
        <CardHeader>
          <CardTitle className="text-text-main flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Syndication Hub
            <Badge className="bg-accent/20 text-accent">
              Connected to Ayrshare
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted">
            Manage your social media content calendar, review incoming submissions, and schedule posts across multiple platforms using Ayrshare integration.
          </p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 bg-card-bg border-border-color">
          <TabsTrigger value="incoming" className="flex items-center gap-2 text-text-muted data-[state=active]:text-text-main">
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">Incoming</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2 text-text-muted data-[state=active]:text-text-main">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 text-text-muted data-[state=active]:text-text-main">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="boosts" className="flex items-center gap-2 text-text-muted data-[state=active]:text-text-main">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Boosts</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-text-muted data-[state=active]:text-text-main">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Incoming Content Tab */}
        <TabsContent value="incoming">
          <IncomingContentView currentCampaign={currentCampaign} />
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <ContentCalendarView currentCampaign={currentCampaign} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="bg-card-bg/50 border-border-color">
            <CardHeader>
              <CardTitle className="text-text-main flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Post Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-main mb-2">Analytics Coming Soon</h3>
                <p className="text-text-muted">
                  Detailed analytics and performance metrics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Boosts Tab */}
        <TabsContent value="boosts">
          <Card className="bg-card-bg/50 border-border-color">
            <CardHeader>
              <CardTitle className="text-text-main flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Boost Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-main mb-2">Boost System</h3>
                <p className="text-text-muted">
                  Advanced boost features and management tools coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="bg-card-bg/50 border-border-color">
            <CardHeader>
              <CardTitle className="text-text-main flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Syndication Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-text-main font-medium mb-2">Ayrshare Integration</h4>
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 font-medium">Connected</span>
                    </div>
                    <p className="text-text-muted text-sm mt-1">
                      User ID: E1A4A8E6-1D0D437E-8C21F52B-A557CFF8
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-text-main font-medium mb-2">Supported Platforms</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { name: 'Instagram', emoji: '📷', status: 'connected' },
                      { name: 'TikTok', emoji: '🎵', status: 'connected' },
                      { name: 'YouTube', emoji: '📺', status: 'connected' },
                      { name: 'X (Twitter)', emoji: '🐦', status: 'connected' },
                      { name: 'Facebook', emoji: '👥', status: 'connected' },
                    ].map((platform) => (
                      <div key={platform.name} className="bg-card-bg border border-border-color rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">{platform.emoji}</div>
                        <div className="text-text-main text-sm font-medium">{platform.name}</div>
                        <div className="text-green-400 text-xs mt-1">Connected</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SyndicationView;
