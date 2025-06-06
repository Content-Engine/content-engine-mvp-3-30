
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink, 
  MessageCircle, 
  Settings,
  Pin,
  Bell
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiscordChatModuleProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentCampaign?: string;
}

const DiscordChatModule = ({ 
  isCollapsed, 
  onToggleCollapse, 
  currentCampaign 
}: DiscordChatModuleProps) => {
  const [selectedChannel, setSelectedChannel] = useState("editor-room");
  const [isConnected, setIsConnected] = useState(false);

  // Mock Discord server ID - replace with actual server ID
  const DISCORD_SERVER_ID = "1234567890123456789";
  
  const channels = [
    { id: "editor-room", name: "#editor-room", description: "General editor chat" },
    { id: "qc-review", name: "#qc-review", description: "Quality control discussions" },
    { id: "content-drops", name: "#content-drops", description: "Latest content updates" },
    ...(currentCampaign ? [{ 
      id: `campaign-${currentCampaign}`, 
      name: `#campaign-${currentCampaign}`, 
      description: "Campaign-specific chat" 
    }] : [])
  ];

  const pinnedMessages = [
    "🔥 Remember to submit QC by 5 PM daily",
    "📋 Use #content-drops for urgent reviews",
    "⚡ Boost approval process: Check calendar first"
  ];

  const handleConnectDiscord = () => {
    // This would integrate with Discord OAuth
    console.log("Connecting to Discord...");
    setIsConnected(true);
  };

  const handleOpenInDiscord = () => {
    window.open(`https://discord.com/channels/${DISCORD_SERVER_ID}`, '_blank');
  };

  const handlePingTeam = () => {
    console.log("Pinging team for current content...");
    // This would send a notification through Discord API
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={onToggleCollapse}
          className="rounded-full w-14 h-14 shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
          3
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 z-40">
      <Card className="h-full shadow-xl border-l-4 border-l-indigo-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              Team Chat (Discord)
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {!isConnected ? (
            <Button
              onClick={handleConnectDiscord}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Connect to Discord
            </Button>
          ) : (
            <div className="space-y-2">
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {channel.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleOpenInDiscord}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open App
                </Button>
                <Button
                  onClick={handlePingTeam}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Ping
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-0">
          {!isConnected ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">Connect to Discord to start chatting with your team</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Pinned Messages */}
              <div className="p-3 bg-muted/30 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Pin className="h-3 w-3 text-amber-600" />
                  <span className="text-xs font-medium">Pinned</span>
                </div>
                <div className="space-y-1">
                  {pinnedMessages.map((message, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-background rounded p-2">
                      {message}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discord Widget */}
              <div className="flex-1 relative">
                <iframe
                  src={`https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`}
                  width="100%"
                  height="100%"
                  allowTransparency={true}
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="rounded-b-lg"
                  title="Discord Chat Widget"
                />
                
                {/* Overlay for mobile responsiveness */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center md:hidden">
                  <div className="text-center p-4">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Better experience on desktop
                    </p>
                    <Button onClick={handleOpenInDiscord} size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Discord
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordChatModule;
