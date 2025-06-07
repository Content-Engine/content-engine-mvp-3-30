
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Users, CheckSquare, MessageSquare, Zap, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CalendarSyndicationPanel from "@/components/manager/CalendarSyndicationPanel";
import KPIPerformanceTracker from "@/components/manager/KPIPerformanceTracker";
import EditorAssignmentPanel from "@/components/manager/EditorAssignmentPanel";
import QualityControlManagerPanel from "@/components/manager/QualityControlManagerPanel";
import DiscordChatPanel from "@/components/manager/DiscordChatPanel";
import BoostTriggerConsole from "@/components/manager/BoostTriggerConsole";

const SocialMediaManagerView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar");

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access Denied",
          description: "Please log in to access the Social Media Manager view.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error checking user role:', error);
        toast({
          title: "Error",
          description: "Failed to verify user permissions.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const hasManagerRole = userRoles?.some(role => 
        role.role === 'admin' || role.role === 'social_media_manager'
      );

      if (!hasManagerRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the Social Media Manager view.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: "Authentication failed.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Media Manager Console
              </h1>
              <p className="text-muted-foreground">
                Comprehensive campaign management and team coordination
              </p>
            </div>
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
    </div>
  );
};

export default SocialMediaManagerView;
