import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { PlatformCard } from "@/components/platform-card";
import { MetricChart } from "@/components/metric-chart";
import { TrendingHashtags, PopularSongs, BestPostTimes } from "@/components/trending-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SocialAccount } from "@shared/schema";

import { TrendingUp, Activity, AlertCircle } from "lucide-react";
import { SiInstagram, SiTiktok, SiFacebook } from "react-icons/si";

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  // Sample data for charts
  const audienceGrowthData = [
    { name: "Jun 1", Instagram: 8400, TikTok: 30000, Facebook: 6800 },
    { name: "Jun 15", Instagram: 9300, TikTok: 34000, Facebook: 7200 },
    { name: "Jul 1", Instagram: 10200, TikTok: 37000, Facebook: 7600 },
    { name: "Jul 15", Instagram: 11200, TikTok: 41000, Facebook: 7900 },
    { name: "Aug 1", Instagram: 12400, TikTok: 45800, Facebook: 8250 },
  ];

  const engagementData = [
    { name: "Instagram", value: 3.2 },
    { name: "TikTok", value: 8.7 },
    { name: "Facebook", value: 1.8 },
  ];

  const contentTypeData = [
    { name: "Photos", value: 65 },
    { name: "Videos", value: 85 },
    { name: "Stories", value: 70 },
    { name: "Reels/TikToks", value: 90 },
    { name: "Text Posts", value: 40 },
    { name: "Live", value: 60 },
  ];

  const recentActivities = [
    {
      platform: "Instagram",
      title: "New follower milestone",
      description: "Your Instagram account reached 12,000+ followers",
      time: "1 hour ago",
      icon: <SiInstagram className="h-4 w-4 text-[#E1306C]" />,
    },
    {
      platform: "TikTok",
      title: "Trending video",
      description: "Your TikTok video \"Summer Vibes\" is trending",
      time: "3 hours ago",
      icon: <SiTiktok className="h-4 w-4" />,
    },
    {
      platform: "Facebook",
      title: "Engagement spike",
      description: "Your Facebook post received 2x more engagement than average",
      time: "Yesterday",
      icon: <SiFacebook className="h-4 w-4 text-[#1877F2]" />,
    },
  ];

  // Mock platform data until API is connected
  const platforms = [
    { id: "instagram", name: "Instagram", connected: true, followers: 12400, engagement: "3.2", posts: 142 },
    { id: "tiktok", name: "TikTok", connected: true, followers: 45800, engagement: "8.7", posts: 78 },
    { id: "facebook", name: "Facebook", connected: true, followers: 8250, engagement: "1.8", posts: 96 },
  ];

  return (
    <Sidebar>
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your social media metrics and insights
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                  <div className="bg-muted/40 px-5 py-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Audience Growth</h2>
          <MetricChart
            title="Audience Growth"
            description="30-day follower growth across platforms"
            data={audienceGrowthData}
            type="line"
            dataKeys={["Instagram", "TikTok", "Facebook"]}
            colors={["#E1306C", "#000000", "#1877F2"]}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <MetricChart
            title="Engagement Rate"
            description="Last 7 days average (%)"
            data={engagementData.map(d => ({ name: d.name, value: d.value }))}
            type="bar"
            dataKeys={["value"]}
            colors={["#4F46E5"]}
          />
          
          <MetricChart
            title="Content Performance"
            description="By post type (out of 100)"
            data={contentTypeData}
            type="radar"
            dataKeys={["value"]}
            colors={["#4F46E5"]}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trending Hashtags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">#SummerVibes</Badge>
                      <Badge variant="secondary">#FitnessGoals</Badge>
                      <Badge variant="secondary">#TechTalk</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Activity className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Popular Songs</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      "Summer Beats" by DJ Sunshine is trending on TikTok
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Best Times to Post</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Saturday 8:00 PM - 10:00 PM shows highest engagement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
