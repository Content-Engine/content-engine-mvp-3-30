
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Zap } from "lucide-react";
import { DayData } from "@/types/calendar";
import CalendarDayModal from "@/components/CalendarDayModal";

const CalendarSyndicationPanel = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedEditor, setSelectedEditor] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // Mock calendar data with color coding
  const calendarData = [
    { date: "2024-01-15", totalPosts: 8, pendingQC: 2, approvedQC: 5, boostedCount: 3, platform: "TikTok", editor: "Sarah K.", syndicationStatus: "synced" },
    { date: "2024-01-16", totalPosts: 12, pendingQC: 4, approvedQC: 7, boostedCount: 2, platform: "Instagram", editor: "Mike D.", syndicationStatus: "pending" },
    { date: "2024-01-17", totalPosts: 6, pendingQC: 1, approvedQC: 4, boostedCount: 5, platform: "YouTube", editor: "Alex R.", syndicationStatus: "failed" },
    { date: "2024-01-18", totalPosts: 10, pendingQC: 3, approvedQC: 6, boostedCount: 4, platform: "Facebook", editor: "Sarah K.", syndicationStatus: "synced" },
  ];

  const platforms = ["TikTok", "Instagram", "YouTube Shorts", "Facebook Reels"];
  const editors = ["Sarah K.", "Mike D.", "Alex R.", "Emma L."];

  const filteredData = calendarData.filter(day => {
    const platformMatch = selectedPlatform === "all" || day.platform === selectedPlatform;
    const editorMatch = selectedEditor === "all" || day.editor === selectedEditor;
    return platformMatch && editorMatch;
  });

  const getSyndicationColor = (status: string) => {
    switch (status) {
      case "synced": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleDayClick = (day: any) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const handleBoostDay = (date: string) => {
    console.log(`Triggering boost for ${date}`);
    // Implement boost logic
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(platform => (
              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedEditor} onValueChange={setSelectedEditor}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Editor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Editors</SelectItem>
            {editors.map(editor => (
              <SelectItem key={editor} value={editor}>{editor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredData.map((day) => (
          <div
            key={day.date}
            className="bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDayClick(day)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className={`w-3 h-3 rounded-full ${getSyndicationColor(day.syndicationStatus)}`} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Total Posts:</span>
                <span className="font-medium">{day.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending QC:</span>
                <span className="text-yellow-600 font-medium">{day.pendingQC}</span>
              </div>
              <div className="flex justify-between">
                <span>Approved:</span>
                <span className="text-green-600 font-medium">{day.approvedQC}</span>
              </div>
              <div className="flex justify-between">
                <span>Boosted:</span>
                <span className="text-orange-600 font-medium">{day.boostedCount}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground mb-2">
                {day.platform} • {day.editor}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBoostDay(day.date);
                }}
              >
                <Zap className="h-3 w-3 mr-1" />
                Boost Day
              </Button>
            </div>

            <div className="mt-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  day.syndicationStatus === 'synced' ? 'text-green-700 border-green-300' :
                  day.syndicationStatus === 'pending' ? 'text-yellow-700 border-yellow-300' :
                  'text-red-700 border-red-300'
                }`}
              >
                {day.syndicationStatus}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Synced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Failed</span>
        </div>
      </div>

      {/* Day Modal */}
      {selectedDay && (
        <CalendarDayModal
          isOpen={showDayModal}
          onClose={() => setShowDayModal(false)}
          dayData={selectedDay}
        />
      )}
    </div>
  );
};

export default CalendarSyndicationPanel;
