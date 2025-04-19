import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { PlatformCard } from "@/components/platform-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LuRefreshCw, LuLink, LuTrash2, LuPlus } from "react-icons/lu";

export default function PlatformsPage() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  
  const { data: socialAccounts, isLoading } = useQuery({
    queryKey: ["/api/social-accounts"],
  });

  // Sample platform data
  const platforms = [
    { id: "instagram", name: "Instagram", connected: true, followers: 12400, engagement: "3.2", posts: 142 },
    { id: "tiktok", name: "TikTok", connected: true, followers: 45800, engagement: "8.7", posts: 78 },
    { id: "facebook", name: "Facebook", connected: true, followers: 8250, engagement: "1.8", posts: 96 },
    { id: "youtube", name: "YouTube", connected: false, followers: 0, engagement: "0", posts: 0 },
    { id: "twitter", name: "Twitter (X)", connected: false, followers: 0, engagement: "0", posts: 0 },
    { id: "pinterest", name: "Pinterest", connected: false, followers: 0, engagement: "0", posts: 0 }
  ];

  const handleConnectAccount = (platform: string) => {
    setSelectedPlatform(platform);
    setConnectDialogOpen(true);
  };

  const handleRefreshAccount = (id: string) => {
    console.log(`Refreshing account: ${id}`);
  };

  const handleDisconnectAccount = (id: string) => {
    console.log(`Disconnecting account: ${id}`);
  };

  return (
    <Sidebar>
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Connected Platforms</h1>
          <p className="text-muted-foreground">
            Manage your social media accounts and connections
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual platform cards
            platforms.map((platform) => (
              <Card key={platform.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{platform.name}</CardTitle>
                    <Badge 
                      variant={platform.connected ? "success" : "outline"}
                      className={!platform.connected ? "text-muted-foreground" : ""}
                    >
                      {platform.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {platform.connected ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Followers</p>
                          <p className="text-xl font-bold">
                            {platform.followers >= 1000
                              ? `${(platform.followers / 1000).toFixed(1)}K`
                              : platform.followers}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Engagement</p>
                          <p className="text-xl font-bold">{platform.engagement}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Posts</p>
                          <p className="text-xl font-bold">{platform.posts}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRefreshAccount(platform.id)}
                        >
                          <LuRefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleDisconnectAccount(platform.id)}
                        >
                          <LuTrash2 className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        Connect your {platform.name} account to track metrics
                      </p>
                      <Button 
                        onClick={() => handleConnectAccount(platform.name)}
                        className="w-full"
                      >
                        <LuLink className="mr-2 h-4 w-4" />
                        Connect Account
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage your API keys and authentications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* OpenAI API Key Section */}
                <div>
                  <label htmlFor="openai-api-key" className="block text-sm font-medium mb-1">
                    OpenAI API Key
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="openai-api-key"
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      defaultValue="••••••••••••••••••••••••"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Used for generating AI insights and recommendations
                  </p>
                </div>

                {/* Platform API Credentials */}
                <div className="pt-4 border-t">
                  <h3 className="text-md font-medium mb-4">Platform API Credentials</h3>
                  <div className="space-y-3">
                    {platforms
                      .filter(p => p.connected)
                      .map(platform => (
                        <div key={platform.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Verified
                            </Badge>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connect Account Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
            <DialogDescription>
              Follow the steps below to connect your {selectedPlatform} account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              You'll be redirected to {selectedPlatform} to authorize access to your account.
              Once authorized, you'll be redirected back to this page.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key (Optional)</label>
              <Input placeholder={`${selectedPlatform} API Key`} />
              <p className="text-xs text-muted-foreground">
                Only required for advanced features. Most users can skip this step.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConnectDialogOpen(false)}>
              Authorize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
