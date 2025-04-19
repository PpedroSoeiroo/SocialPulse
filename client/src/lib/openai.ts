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
export async function generateContent(contentType: string, description: string) {
  const res = await apiRequest("POST", "/api/ai/generate-content", {
    contentType,
    description,
  });
  return await res.json();
}
