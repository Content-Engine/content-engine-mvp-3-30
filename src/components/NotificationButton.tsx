
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationButton = () => {
  const { notifications, unreadCount, markAsRead, respondToAffiliationInvitation } = useNotifications();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleAffiliationResponse = async (notificationId: string, affiliationId: string, accept: boolean) => {
    try {
      await respondToAffiliationInvitation(notificationId, affiliationId, accept);
      toast({
        title: accept ? "Invitation Accepted" : "Invitation Declined",
        description: accept 
          ? "You are now affiliated with this admin." 
          : "The invitation has been declined.",
      });
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast({
        title: "Error",
        description: "Failed to respond to invitation.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => {
              // Type assertion for affiliation invitation data
              const affiliationData = notification.data as { affiliation_id?: string; inviter_id?: string } | null;
              
              return (
                <div
                  key={notification.id}
                  className={`border-b p-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h5 className="font-medium text-sm">{notification.title}</h5>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                    
                    {notification.type === 'affiliation_invitation' && affiliationData?.affiliation_id && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAffiliationResponse(
                              notification.id,
                              affiliationData.affiliation_id!,
                              true
                            );
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAffiliationResponse(
                              notification.id,
                              affiliationData.affiliation_id!,
                              false
                            );
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
