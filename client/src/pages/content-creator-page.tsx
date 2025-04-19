import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { analyzeContentPerformance, generateCaptionVariations, generateContent } from "@/lib/openai";

// Form schema for content generation
const formSchema = z.object({
  contentType: z.string({
    required_error: "Please select a content type",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  platform: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Form schema for content analysis
const analysisFormSchema = z.object({
  contentSample: z.string().min(10, {
    message: "Content must be at least 10 characters",
  }),
  platform: z.string({
    required_error: "Please select a platform",
  }),
});

// Form schema for caption variations
const captionFormSchema = z.object({
  caption: z.string().min(5, {
    message: "Caption must be at least 5 characters",
  }),
  platform: z.string({
    required_error: "Please select a platform",
  }),
  count: z.number().min(1).max(5).default(3),
});

export default function ContentCreatorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generate");

  // States for loading and results
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [captionVariations, setCaptionVariations] = useState<any | null>(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  // Form for content generation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: "hashtags",
      description: "",
      platform: "instagram",
    },
  });

  // Form for content analysis
  const analysisForm = useForm<z.infer<typeof analysisFormSchema>>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      contentSample: "",
      platform: "instagram",
    },
  });

  // Form for caption variations
  const captionForm = useForm<z.infer<typeof captionFormSchema>>({
    resolver: zodResolver(captionFormSchema),
    defaultValues: {
      caption: "",
      platform: "instagram",
      count: 3,
    },
  });

  const onGenerateSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    
    try {
      const result = await generateContent(
        values.contentType, 
        values.description,
        values.platform
      );
      
      setGeneratedContent(result.content);
      
      toast({
        title: "Content Generated",
        description: "Your content has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onAnalysisSubmit = async (values: z.infer<typeof analysisFormSchema>) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeContentPerformance(
        values.contentSample,
        values.platform
      );
      
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed",
      });
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        title: "Error",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onCaptionSubmit = async (values: z.infer<typeof captionFormSchema>) => {
    setIsGeneratingCaptions(true);
    setCaptionVariations(null);
    
    try {
      const result = await generateCaptionVariations(
        values.caption,
        values.platform,
        values.count
      );
      
      setCaptionVariations(result);
      
      toast({
        title: "Caption Variations Generated",
        description: "Your caption variations have been created",
      });
    } catch (error) {
      console.error("Error generating caption variations:", error);
      toast({
        title: "Error",
        description: "Failed to generate caption variations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter/X" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "pinterest", label: "Pinterest" },
  ];

  const contentTypes = [
    { value: "hashtags", label: "Hashtags" },
    { value: "caption", label: "Caption" },
    { value: "content ideas", label: "Content Ideas" },
    { value: "post schedule", label: "Post Schedule" },
    { value: "engagement questions", label: "Engagement Questions" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Content Creator</h1>
      <p className="text-muted-foreground">
        Use AI to generate content, analyze performance, and create caption variations for your social media posts.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Performance</TabsTrigger>
          <TabsTrigger value="variations">Caption Variations</TabsTrigger>
        </TabsList>

        {/* Generate Content Tab */}
        <TabsContent value="generate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>
                Create platform-optimized content for your social media posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onGenerateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select content type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the type of content you want to generate
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select a platform to optimize content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want to create content about..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide context for your content generation request
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            {generatedContent && (
              <CardFooter className="flex flex-col items-start border-t p-4">
                <h3 className="font-medium text-lg mb-2">Generated Content:</h3>
                <div className="w-full bg-muted rounded-md p-4 whitespace-pre-wrap">
                  {generatedContent}
                </div>
                <div className="flex justify-end w-full mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      toast({
                        title: "Copied",
                        description: "Content copied to clipboard",
                      });
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Analyze Performance Tab */}
        <TabsContent value="analyze" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Content Performance</CardTitle>
              <CardDescription>
                Get AI predictions about how your content will perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...analysisForm}>
                <form onSubmit={analysisForm.handleSubmit(onAnalysisSubmit)} className="space-y-4">
                  <FormField
                    control={analysisForm.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the platform where you'll post this content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={analysisForm.control}
                    name="contentSample"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content to Analyze</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your content here for analysis..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Paste a caption, post text, or any content you want analyzed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Content"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            {analysisResult && (
              <CardFooter className="flex flex-col items-start border-t p-4">
                <h3 className="font-medium text-lg mb-4">Analysis Results:</h3>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Engagement Prediction</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">
                        {analysisResult.engagementPrediction || "Medium"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p>
                        {analysisResult.targetAudienceAppeal || "General audience with interest in this topic"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Improvements</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.improvements?.map((improvement: string, i: number) => (
                          <li key={i}>{improvement}</li>
                        )) || (
                          <>
                            <li>Add more engaging questions to increase comments</li>
                            <li>Include relevant trending hashtags</li>
                            <li>Consider adding a stronger call-to-action</li>
                          </>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Best Posting Time</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p>{analysisResult.bestTimeToPost || "Weekdays between 6-8 PM"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Recommended Hashtags</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="break-words">{analysisResult.complementaryHashtags || "#trending #content #socialmedia"}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Caption Variations Tab */}
        <TabsContent value="variations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Caption Variations</CardTitle>
              <CardDescription>
                Create multiple versions of your caption with different tones and styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...captionForm}>
                <form onSubmit={captionForm.handleSubmit(onCaptionSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={captionForm.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={captionForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Variations</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Number of variations" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={captionForm.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Caption Idea</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your caption idea or concept..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a basic idea or topic for your caption
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isGeneratingCaptions} className="w-full">
                    {isGeneratingCaptions ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Variations...
                      </>
                    ) : (
                      "Generate Caption Variations"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            {captionVariations && (
              <CardFooter className="flex flex-col items-start border-t p-4">
                <h3 className="font-medium text-lg mb-4">Caption Variations:</h3>
                <div className="w-full space-y-4">
                  {captionVariations.variations?.map((variation: any, i: number) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-muted/50">
                        <CardTitle className="text-base">
                          Variation {i + 1} - {variation.tone || "Style"} 
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="mb-3">{variation.caption || "Generated caption will appear here"}</p>
                        {variation.hashtags && (
                          <p className="text-sm text-muted-foreground break-words">
                            {typeof variation.hashtags === 'string' 
                              ? variation.hashtags 
                              : variation.hashtags.join(' ')}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const textToCopy = 
                              `${variation.caption}\n\n${typeof variation.hashtags === 'string' 
                                ? variation.hashtags 
                                : variation.hashtags.join(' ')}`;
                            navigator.clipboard.writeText(textToCopy);
                            toast({
                              title: "Copied",
                              description: "Caption copied to clipboard",
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}