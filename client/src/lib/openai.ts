import { apiRequest } from "./queryClient";

// Get AI-generated trending content (hashtags, songs, post times)
export async function fetchTrendingContent() {
  const res = await apiRequest("GET", "/api/ai/trending-content");
  return await res.json();
}

// Get content recommendations for a specific platform
export async function fetchContentRecommendations(platform: string) {
  const res = await apiRequest("GET", `/api/ai/content-recommendations/${platform}`);
  return await res.json();
}

// Generate content using AI
export async function generateContent(contentType: string, description: string, platform?: string) {
  const res = await apiRequest("POST", "/api/ai/generate-content", {
    contentType,
    description,
    platform
  });
  return await res.json();
}

// Analyze content performance
export async function analyzeContentPerformance(contentSample: string, platform: string) {
  const res = await apiRequest("POST", "/api/ai/analyze-content", {
    contentSample,
    platform
  });
  return await res.json();
}

// Generate caption variations
export async function generateCaptionVariations(caption: string, platform: string, count: number = 3) {
  const res = await apiRequest("POST", "/api/ai/caption-variations", {
    caption,
    platform,
    count
  });
  return await res.json();
}

// Get personalized content suggestions based on user's account performance
export async function getPersonalizedSuggestions(platform: string, contentHistory?: any[]) {
  const res = await apiRequest("POST", "/api/ai/personalized-suggestions", {
    platform,
    contentHistory
  });
  return await res.json();
}
