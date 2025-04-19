import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SiInstagram, SiTiktok, SiFacebook, SiYoutube, SiX, SiPinterest } from "react-icons/si";
import { TrendingUp } from "lucide-react";

type Platform = {
  id: string;
  name: string;
  connected: boolean;
  followers: number;
  engagement: string;
  posts: number;
};

type PlatformCardProps = {
  platform: Platform;
  variant?: "overview" | "detailed";
  className?: string;
};

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get the right icon for each platform
function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <SiInstagram className="h-5 w-5 text-[#E1306C]" />;
    case 'tiktok':
      return <SiTiktok className="h-5 w-5" />;
    case 'facebook':
      return <SiFacebook className="h-5 w-5 text-[#1877F2]" />;
    case 'youtube':
      return <SiYoutube className="h-5 w-5 text-[#FF0000]" />;
    case 'twitter':
    case 'twitter (x)':
      return <SiX className="h-5 w-5 text-[#1DA1F2]" />;
    case 'pinterest':
      return <SiPinterest className="h-5 w-5 text-[#E60023]" />;
    default:
      return <TrendingUp className="h-5 w-5" />;
  }
}

// Get the appropriate border color for each platform
function getPlatformBorderColor(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return "border-t-[#E1306C]";
    case 'tiktok':
      return "border-t-black";
    case 'facebook':
      return "border-t-[#1877F2]";
    case 'youtube':
      return "border-t-[#FF0000]";
    case 'twitter':
    case 'twitter (x)':
      return "border-t-[#1DA1F2]";
    case 'pinterest':
      return "border-t-[#E60023]";
    default:
      return "border-t-primary";
  }
}

export function PlatformCard({ platform, variant = "overview", className = "" }: PlatformCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-transform hover:-translate-y-1 border-t-4 ${getPlatformBorderColor(platform.name)} ${className}`}
    >
      {variant === "overview" ? (
        // Overview card for dashboard
        <>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getPlatformIcon(platform.name)}
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-sm font-medium text-muted-foreground truncate">{platform.name}</h3>
                <p className="text-lg font-medium">{formatNumber(platform.followers)} followers</p>
              </div>
            </div>
          </CardContent>
          <div className="bg-muted/40 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement rate</span>
                <span className="font-medium">{platform.engagement}%</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Total posts</span>
                <span className="font-medium">{platform.posts}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Detailed card for platforms page
        <>
          <CardHeader className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getPlatformIcon(platform.name)}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">{platform.name}</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <div>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      platform.connected 
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {platform.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>
              </div>
              
              {platform.connected && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="font-medium">{formatNumber(platform.followers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement rate</span>
                    <span className="font-medium">{platform.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total posts</span>
                    <span className="font-medium">{platform.posts}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
