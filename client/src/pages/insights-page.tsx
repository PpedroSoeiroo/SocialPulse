import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TrendingHashtags, PopularSongs, BestPostTimes } from "@/components/trending-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Lightbulb, Hash, Music, Clock, RefreshCw } from "lucide-react";
import { SiInstagram, SiTiktok, SiFacebook } from "react-icons/si";

export default function InsightsPage() {
  const [contentType, setContentType] = useState("caption");
  const [contentPrompt, setContentPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  
  // Fetch trending data
  const { 
    data: trendingData, 
    isLoading,
    refetch: refetchTrending,
    isRefetching 
  } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  // Content generation mutation
  const generateContentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-content", {
        contentType,
        description: contentPrompt,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
    },
  });

  // Sample content recommendations (in real app, these would come from the API)
  const contentRecommendations = {
    instagram: [
      {
        title: "Behind-the-scenes content",
        description: "Your audience responds well to authentic content showing your process."
      }
    ],
    tiktok: [
      {
        title: "Tutorial videos",
        description: "Step-by-step tutorials are performing 43% better than other content types."
      }
    ],
    facebook: [
      {
        title: "Interactive polls & questions",
        description: "Increase engagement by asking your audience questions about their preferences."
      }
    ]
  };

  // Sample trending data for UI until real data is loaded
  const sampleTrendingHashtags = [
    { tag: '#SummerVibes', growth: 127, category: 'Lifestyle' },
    { tag: '#FitnessGoals', growth: 89, category: 'Health' },
    { tag: '#TechTalk', growth: 78, category: 'Technology' },
    { tag: '#FoodieLife', growth: 63, category: 'Food' },
    { tag: '#TravelDreams', growth: 45, category: 'Travel' }
  ];
  
  const samplePopularSongs = [
    { title: 'Summer Beats', artist: 'DJ Sunshine', uses: '1.2M', platform: 'TikTok' },
    { title: 'Dance With Me', artist: 'Groove Masters', uses: '985K', platform: 'Instagram' },
    { title: 'Viral Symphony', artist: 'The Trending', uses: '754K', platform: 'TikTok' },
    { title: 'Feel the Rhythm', artist: 'Beat Makers', uses: '612K', platform: 'TikTok' }
  ];
  
  const sampleBestPostTimes = [
    { day: 'Monday', time: '6:00 PM - 8:00 PM', engagement: 'High' },
    { day: 'Wednesday', time: '12:00 PM - 2:00 PM', engagement: 'Medium' },
    { day: 'Friday', time: '9:00 AM - 11:00 AM', engagement: 'High' },
    { day: 'Saturday', time: '8:00 PM - 10:00 PM', engagement: 'Very High' }
  ];

  // Handle content generation
  const handleGenerateContent = () => {
    if (!contentPrompt) return;
    
    generateContentMutation.mutate();
  };

  // Handle refresh trending data
  const handleRefreshTrending = () => {
    refetchTrending();
  };

  return (
    <Sidebar>
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <Button 
              variant="outline" 
              onClick={handleRefreshTrending}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
          <p className="text-muted-foreground">
            Powered by OpenAI's GPT to help optimize your social media strategy
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Trending Hashtags */}
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <TrendingHashtags hashtags={sampleTrendingHashtags} />
          )}

          {/* Popular Songs */}
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <PopularSongs songs={samplePopularSongs} />
          )}

          {/* Best Times to Post */}
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <BestPostTimes times={sampleBestPostTimes} />
          )}

          {/* Content Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Content Recommendations</CardTitle>
              </div>
              <CardDescription>
                AI-generated content ideas based on your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <SiInstagram className="h-4 w-4 text-[#E1306C] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Behind-the-scenes content</p>
                    <p className="text-sm text-muted-foreground">
                      Your audience responds well to authentic content showing your process.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <SiTiktok className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tutorial videos</p>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step tutorials are performing 43% better than other content types.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <SiFacebook className="h-4 w-4 text-[#1877F2] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Interactive polls & questions</p>
                    <p className="text-sm text-muted-foreground">
                      Increase engagement by asking your audience questions about their preferences.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Content Generator */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>AI Content Generator</CardTitle>
              </div>
              <CardDescription>
                Generate captions, hashtags, and ideas for your posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="content-type" className="block text-sm font-medium mb-2">
                    What do you want to create?
                  </label>
                  <Select 
                    value={contentType}
                    onValueChange={(value) => setContentType(value)}
                  >
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caption">Post Caption</SelectItem>
                      <SelectItem value="hashtags">Hashtag Set</SelectItem>
                      <SelectItem value="ideas">Content Ideas</SelectItem>
                      <SelectItem value="response">Response to Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="content-prompt" className="block text-sm font-medium mb-2">
                    Describe your content
                  </label>
                  <Textarea
                    id="content-prompt"
                    placeholder="E.g. A photo of my homemade pasta dish with fresh ingredients"
                    rows={3}
                    value={contentPrompt}
                    onChange={(e) => setContentPrompt(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerateContent}
                    disabled={!contentPrompt || generateContentMutation.isPending}
                  >
                    {generateContentMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate"}
                  </Button>
                </div>
                
                {generatedContent && (
                  <div className="mt-4">
                    <Separator className="my-4" />
                    <h3 className="text-sm font-medium mb-2">Generated Content:</h3>
                    <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
