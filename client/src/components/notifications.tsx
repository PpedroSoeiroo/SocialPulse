import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read?: boolean;
};

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;
    
    // Close any existing connection
    if (socket) {
      socket.close();
    }
    
    // Create a new WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);
    
    // Set up event handlers
    newSocket.onopen = () => {
      // Authenticate with the server
      newSocket.send(JSON.stringify({
        type: 'auth',
        userId: user.id
      }));
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const newNotification = {
            ...data.notification,
            read: false
          };
          
          // Add the notification
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Also show a toast
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default'
          });
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    setSocket(newSocket);
    
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, [user, toast]);
  
  // Mark notifications as read
  const markAsRead = (id?: number) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (id === undefined || notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      })
    );
    
    // Update unread count
    setUnreadCount(
      id === undefined 
        ? 0 
        : prev => prev - (notifications.find(n => n.id === id && !n.read) ? 1 : 0)
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    markAsRead();
  };
  
  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };
  
  // Send a test notification
  const sendTestNotification = async () => {
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test notification sent from the client.',
          type: 'success'
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  };
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendTestNotification
  };
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, sendTestNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center translate-x-1/4 -translate-y-1/4">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center p-4 pb-2">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
              <p className="mb-2">No notifications</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={sendTestNotification}
              >
                Send Test Notification
              </Button>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onRead={() => markAsRead(notification.id)} 
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

type NotificationCardProps = {
  notification: Notification;
  onRead: () => void;
};

function getNotificationColor(type: Notification['type']) {
  switch (type) {
    case 'success':
      return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    case 'warning':
      return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    case 'error':
      return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    default:
      return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
  }
}

function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const formattedTime = new Date(notification.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  useEffect(() => {
    if (!notification.read) {
      const timer = setTimeout(() => {
        onRead();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.read, onRead]);
  
  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer", 
        notification.read 
          ? "bg-background" 
          : "bg-muted/40"
      )}
      onClick={onRead}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              {!notification.read && (
                <Badge variant="outline" className="h-5 text-[10px]">New</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formattedTime}</p>
          </div>
          <Badge
            className={cn(
              "w-2 h-2 rounded-full p-0 border-0",
              getNotificationColor(notification.type)
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}