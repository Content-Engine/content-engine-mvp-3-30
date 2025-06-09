
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart3, Users, CheckSquare, MessageSquare, Zap } from "lucide-react";
import CalendarSyndicationPanel from "@/components/manager/CalendarSyndicationPanel";
import KPIPerformanceTracker from "@/components/manager/KPIPerformanceTracker";
import EditorAssignmentPanel from "@/components/manager/EditorAssignmentPanel";
import QualityControlManagerPanel from "@/components/manager/QualityControlManagerPanel";
import DiscordChatPanel from "@/components/manager/DiscordChatPanel";
import BoostTriggerConsole from "@/components/manager/BoostTriggerConsole";
import Layout from "@/components/Layout";

const SocialMediaManagerView = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Social Media Manager Console
            </h1>
            <p className="text-muted-foreground">
              Comprehensive campaign management and team coordination
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Manager Access
          </Badge>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="kpi" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="editors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Editors</span>
            </TabsTrigger>
            <TabsTrigger value="qc" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">QC Panel</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discord</span>
            </TabsTrigger>
            <TabsTrigger value="boost" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Boost</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendar Syndication Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarSyndicationPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  KPI Performance Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KPIPerformanceTracker />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Editor Assignment Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditorAssignmentPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Quality Control Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QualityControlManagerPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Discord Campaign Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DiscordChatPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boost">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Boost Trigger Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BoostTriggerConsole />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SocialMediaManagerView;
