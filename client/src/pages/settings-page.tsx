import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  LuKey, 
  LuBell, 
  LuSave, 
  LuPalette, 
  LuGlobe, 
  LuShieldAlert, 
  LuRefreshCw 
} from "react-icons/lu";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // API keys state
  const [openAIKey, setOpenAIKey] = useState("");
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [trendAlerts, setTrendAlerts] = useState(true);
  
  // Display settings state
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("utc");
  const [dataRefreshInterval, setDataRefreshInterval] = useState("30");
  
  // Handle save API keys
  const handleSaveAPIKeys = () => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "API keys updated",
        description: "Your API keys have been saved successfully",
      });
    }, 1000);
  };
  
  // Handle save notification settings
  const handleSaveNotificationSettings = () => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved successfully",
      });
    }, 1000);
  };
  
  // Handle save display settings
  const handleSaveDisplaySettings = () => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Display settings updated",
        description: "Your display settings have been saved successfully",
      });
    }, 1000);
  };
  
  // Handle data refresh
  const handleRefreshAllData = () => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Data refreshed",
        description: "All your social media data has been refreshed",
      });
    }, 1500);
  };

  return (
    <Sidebar>
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and API connections
          </p>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <LuKey className="h-4 w-4" />
                <span className="hidden sm:inline">API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <LuBell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2">
                <LuPalette className="h-4 w-4" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <LuRefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
            </TabsList>
            
            {/* API Keys Tab */}
            <TabsContent value="api-keys">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Manage your API keys for various services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="openai-key">OpenAI API Key</Label>
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key
                      </a>
                    </div>
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="sk-..."
                      value={openAIKey}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for AI-powered trend analysis and content generation
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Social Media Platform Keys</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <LuShieldAlert className="h-4 w-4 text-muted-foreground" />
                          Facebook API
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <LuShieldAlert className="h-4 w-4 text-muted-foreground" />
                          Instagram API
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <LuShieldAlert className="h-4 w-4 text-muted-foreground" />
                          TikTok API
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveAPIKeys}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LuSave className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <LuSave className="mr-2 h-4 w-4" />
                          Save API Keys
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications about your account via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive weekly performance reports for your social accounts
                        </p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={weeklyReports}
                        onCheckedChange={setWeeklyReports}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trend-alerts">Trend Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified about trending topics related to your content
                        </p>
                      </div>
                      <Switch
                        id="trend-alerts"
                        checked={trendAlerts}
                        onCheckedChange={setTrendAlerts}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveNotificationSettings}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LuSave className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <LuSave className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Display Settings Tab */}
            <TabsContent value="display">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize the appearance and behavior of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="theme-select">Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger id="theme-select">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language-select">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language-select">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="timezone-select">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger id="timezone-select">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Time (ET)</SelectItem>
                            <SelectItem value="cst">Central Time (CT)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                            <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="refresh-interval">Data Refresh Interval (minutes)</Label>
                        <Select value={dataRefreshInterval} onValueChange={setDataRefreshInterval}>
                          <SelectTrigger id="refresh-interval">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="360">6 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveDisplaySettings}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LuSave className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <LuSave className="mr-2 h-4 w-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Data Management Tab */}
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage your social media data and synchronization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium">Refresh All Data</h3>
                      <p className="text-xs text-muted-foreground">
                        Manually refresh all your social media metrics and insights
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-2 w-full sm:w-auto"
                        onClick={handleRefreshAllData}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <LuRefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Refreshing data...
                          </>
                        ) : (
                          <>
                            <LuRefreshCw className="mr-2 h-4 w-4" />
                            Refresh All Data
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium">Data Storage</h3>
                      <p className="text-xs text-muted-foreground">
                        Clear stored data or export your information
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                          Clear Cache
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Export Data
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium">Account Data</h3>
                      <p className="text-xs text-muted-foreground">
                        Manage your personal account data
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                          Download My Data
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full sm:w-auto"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Sidebar>
  );
}

import { Badge } from "@/components/ui/badge";
