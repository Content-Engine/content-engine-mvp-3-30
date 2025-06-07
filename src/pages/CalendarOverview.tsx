import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Clock, XCircle, Zap, Plus, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { CalendarContent, CalendarFilters, DayData } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import CalendarDayModal from "@/components/CalendarDayModal";

const CalendarOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    platform: 'all',
    contentType: 'all',
    editor: 'all',
    boostedOnly: false
  });

  // Mock calendar data
  const [calendarData, setCalendarData] = useState<DayData[]>([]);

  useEffect(() => {
    // Generate mock calendar data for the current month
    const generateCalendarData = () => {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const days: DayData[] = [];

      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        
        // Mock data for each day
        const totalPosts = Math.floor(Math.random() * 5) + 1;
        const pendingQC = Math.floor(Math.random() * 3);
        const approvedQC = Math.floor(Math.random() * 3) + 1;
        const rejectedQC = Math.floor(Math.random() * 2);
        const boostedCount = Math.floor(Math.random() * 2);

        days.push({
          date: dateString,
          totalPosts,
          pendingQC,
          approvedQC,
          rejectedQC,
          boostedCount,
          editors: ['Sarah K.', 'Mike D.', 'Alex R.'].slice(0, Math.floor(Math.random() * 3) + 1),
          platforms: ['TikTok', 'Instagram', 'YouTube Shorts'].slice(0, Math.floor(Math.random() * 3) + 1),
          content: [] // Would be populated with actual content
        });
      }
      setCalendarData(days);
    };

    generateCalendarData();
  }, [currentDate]);

  const getDaysInMonth = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    
    const days = [];
    const current = new Date(startOfWeek);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const handleDayClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayData = calendarData.find(d => d.date === dateString);
    
    if (dayData && dayData.totalPosts > 0) {
      setSelectedDay(dayData);
      setIsDayModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getDayData = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarData.find(d => d.date === dateString);
  };

  const getQCStatusIcon = (dayData: DayData) => {
    if (dayData.pendingQC > 0) return <Clock className="h-3 w-3 text-yellow-500" />;
    if (dayData.rejectedQC > 0) return <XCircle className="h-3 w-3 text-red-500" />;
    return <CheckCircle className="h-3 w-3 text-green-500" />;
  };

  const days = getDaysInMonth();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-foreground/90 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Content Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
                    <SelectItem value="Facebook Reels">Facebook</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.contentType} onValueChange={(value) => setFilters({...filters, contentType: value})}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Reel">Reel</SelectItem>
                    <SelectItem value="Ad">Ad</SelectItem>
                    <SelectItem value="Post">Post</SelectItem>
                    <SelectItem value="Story">Story</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.editor} onValueChange={(value) => setFilters({...filters, editor: value})}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Editor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Editors</SelectItem>
                    <SelectItem value="Sarah K.">Sarah K.</SelectItem>
                    <SelectItem value="Mike D.">Mike D.</SelectItem>
                    <SelectItem value="Alex R.">Alex R.</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={filters.boostedOnly}
                    onCheckedChange={(checked) => setFilters({...filters, boostedOnly: checked})}
                  />
                  <span className="text-sm">Boosted Only</span>
                </div>
              </div>

              <Button onClick={() => navigate('/quality-control')} variant="outline">
                <Users className="h-4 w-4 mr-2" />
                QC Panel
              </Button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => navigateMonth('prev')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">{formatMonth(currentDate)}</h2>
              <Button variant="outline" onClick={() => navigateMonth('next')}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const dayData = getDayData(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[120px] p-2 rounded-lg border cursor-pointer transition-all
                      ${isCurrentMonthDay ? 'bg-card hover:bg-muted/50' : 'bg-muted/30 text-muted-foreground'}
                      ${isTodayDate ? 'border-primary border-2 bg-primary/5' : 'border-border'}
                      ${dayData && dayData.totalPosts > 0 ? 'hover:shadow-md' : ''}
                    `}
                    onClick={() => handleDayClick(date)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${isTodayDate ? 'text-primary' : ''}`}>
                        {date.getDate()}
                      </span>
                      {dayData && dayData.boostedCount > 0 && (
                        <Zap className="h-3 w-3 text-orange-500" />
                      )}
                    </div>

                    {dayData && dayData.totalPosts > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">{dayData.totalPosts} posts</span>
                          {getQCStatusIcon(dayData)}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {dayData.platforms.slice(0, 2).map(platform => (
                            <Badge key={platform} variant="secondary" className="text-xs px-1 py-0">
                              {platform === 'TikTok' ? '🎵' : platform === 'Instagram' ? '📷' : '📺'}
                            </Badge>
                          ))}
                          {dayData.platforms.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{dayData.platforms.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {dayData.editors.slice(0, 3).map((editor, i) => (
                            <div
                              key={editor}
                              className="w-5 h-5 rounded-full bg-primary/20 text-xs flex items-center justify-center"
                              title={editor}
                            >
                              {editor.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Detail Modal */}
        {selectedDay && (
          <CalendarDayModal
            isOpen={isDayModalOpen}
            onClose={() => setIsDayModalOpen(false)}
            dayData={selectedDay}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarOverview;
