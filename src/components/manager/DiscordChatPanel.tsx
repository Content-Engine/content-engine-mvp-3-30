
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Hash, Users, Settings } from "lucide-react";

const DiscordChatPanel = () => {
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [onlineUsers] = useState([
    { name: "Sarah K.", status: "online", role: "Editor" },
    { name: "Mike D.", status: "busy", role: "Editor" },
    { name: "Alex R.", status: "away", role: "Editor" },
    { name: "Manager", status: "online", role: "Manager" },
  ]);

  // Mock chat messages
  const [messages] = useState([
    {
      id: 1,
      author: "Sarah K.",
      content: "Just uploaded the morning workout video for the fitness campaign!",
      timestamp: "10:30 AM",
      role: "Editor"
    },
    {
      id: 2,
      author: "Manager",
      content: "Great work Sarah! Can you also work on the recipe tutorial next?",
      timestamp: "10:32 AM",
      role: "Manager"
    },
    {
      id: 3,
      author: "Mike D.",
      content: "I'm facing some technical issues with the upload. Can someone help?",
      timestamp: "10:45 AM",
      role: "Editor"
    },
    {
      id: 4,
      author: "Alex R.",
      content: "I can help with that Mike, sending you a DM",
      timestamp: "10:47 AM",
      role: "Editor"
    }
  ]);

  const channels = [
    { id: "general", name: "general", campaign: "All" },
    { id: "fitness-q1", name: "fitness-q1", campaign: "Fitness Q1" },
    { id: "food-content", name: "food-content", campaign: "Food Content" },
    { id: "tech-reviews", name: "tech-reviews", campaign: "Tech Reviews" },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add message logic here
    console.log(`Sending message to #${selectedChannel}: ${message}`);
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "away": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager": return "text-purple-600 bg-purple-100";
      case "Editor": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
        {/* Channel List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedChannel === channel.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    <span>{channel.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-5">
                    {channel.campaign}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {selectedChannel}
              </CardTitle>
              <Button size="sm" variant="outline">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {/* Messages */}
            <div className="space-y-3 mb-4 h-64 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{msg.author}</span>
                    <Badge variant="outline" className={`text-xs ${getRoleColor(msg.role)}`}>
                      {msg.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-0">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Message #${selectedChannel}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Online ({onlineUsers.filter(u => u.status === 'online').length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline">
          📌 Pin Important Message
        </Button>
        <Button size="sm" variant="outline">
          📢 Send Announcement
        </Button>
        <Button size="sm" variant="outline">
          👥 Mention All Editors
        </Button>
        <Button size="sm" variant="outline">
          📊 Share Performance Update
        </Button>
      </div>
    </div>
  );
};

export default DiscordChatPanel;
