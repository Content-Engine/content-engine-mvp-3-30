
import { useState } from 'react';
import { Bell, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotificationQueue } from '@/hooks/useNotificationQueue';
import { format } from 'date-fns';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, loading, markAsRead, getUnreadCount, getInAppNotifications } = useNotificationQueue();

  const unreadCount = getUnreadCount();
  const inAppNotifications = getInAppNotifications();

  const getNotificationIcon = (title: string) => {
    if (title.includes('Success') || title.includes('Published')) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
    if (title.includes('Failed') || title.includes('Error')) {
      return <XCircle className="h-4 w-4 text-red-400" />;
    }
    if (title.includes('Scheduled')) {
      return <Clock className="h-4 w-4 text-blue-400" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-400" />;
  };

  const getNotificationColor = (title: string, status: string) => {
    if (status === 'sent') return 'opacity-60';
    if (title.includes('Success') || title.includes('Published')) {
      return 'border-l-green-400';
    }
    if (title.includes('Failed') || title.includes('Error')) {
      return 'border-l-red-400';
    }
    if (title.includes('Scheduled')) {
      return 'border-l-blue-400';
    }
    return 'border-l-yellow-400';
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {inAppNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {inAppNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-4 border-l-2 hover:bg-muted/50 cursor-pointer transition-colors
                        ${getNotificationColor(notification.title, notification.status)}
                      `}
                      onClick={() => {
                        if (notification.status !== 'sent') {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.title)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.data?.campaign_id && (
                            <Badge variant="outline" className="text-xs">
                              Campaign ID: {notification.data.campaign_id.slice(0, 8)}...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
