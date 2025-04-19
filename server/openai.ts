import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function getTrendingContent() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media analytics expert. Generate trending content insights for social media platforms including trending hashtags, popular songs, and best posting times. Provide data in JSON format."
        },
        {
          role: "user",
          content: "Generate trending social media insights for today. Include 5 trending hashtags with growth percentages and categories, 4 popular songs with artist names and usage statistics, and 4 best posting times with days and engagement levels. Return data in JSON format with these keys: trendingHashtags, popularSongs, and bestPostTimes."
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    // Parse and return the response
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to fetch trending content from OpenAI");
  }
}

export async function getContentRecommendations(platform: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media content strategist. Generate content recommendations for different platforms."
        },
        {
          role: "user",
          content: `Generate 3 content recommendations for ${platform}. Include a title and description for each recommendation. Return as JSON with a recommendations array containing objects with title and description fields.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to get content recommendations for ${platform}`);
  }
}

export async function generateContent(contentType: string, description: string, platform?: string) {
  try {
    // Craft prompt based on content type and platform
    let prompt = `Generate ${contentType} based on this description: "${description}".`;
    
    // Add platform-specific instructions if provided
    if (platform) {
      prompt += ` Optimize this content specifically for ${platform}, following its best practices and format.`;
    }
    
    // Add content type specific instructions
    switch (contentType) {
      case 'hashtags':
        prompt += ` Include a set of 10-15 relevant, trending tags that would maximize reach. Mix popular hashtags with niche ones for better targeting.`;
        break;
      case 'caption':
        prompt += ` Write an engaging caption with appropriate emojis that will drive user interaction. Include a call-to-action and keep within optimal character count for the platform.`;
        break;
      case 'content ideas':
        prompt += ` Suggest 5 specific post concepts that would perform well, including the type of media (image, video, carousel), content focus, and potential engagement hooks.`;
        break;
      case 'post schedule':
        prompt += ` Create a 7-day posting schedule with optimal times, content themes for each day, and platform-specific format recommendations.`;
        break;
      case 'engagement questions':
        prompt += ` Generate 5 questions that could be included in posts to increase comments and user interaction. Make them relevant to the topic but easy to answer.`;
        break;
    }
    
    // Request JSON format for structured content types
    const useJsonFormat = ['content ideas', 'post schedule'].includes(contentType);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator specializing in creating engaging, platform-optimized content that drives engagement and follows current best practices."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: useJsonFormat ? { type: "json_object" } : undefined
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate ${contentType}`);
  }
}

export async function analyzeContentPerformance(contentSample: string, platform: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media analytics expert specializing in content performance prediction."
        },
        {
          role: "user",
          content: `Analyze this ${platform} content and predict its performance: "${contentSample}". Provide feedback on: 1) Engagement prediction (low/medium/high), 2) Target audience appeal, 3) Three specific improvements, 4) Best time to post this content, 5) Complementary hashtags.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to analyze content performance`);
  }
}

export async function generateCaptionVariations(caption: string, platform: string, count: number = 3) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media copywriting expert who specializes in creating engaging captions."
        },
        {
          role: "user",
          content: `Based on this caption idea: "${caption}", generate ${count} different variations optimized for ${platform}. Each should have a different tone (professional, casual, humorous, etc.) but maintain the core message. Include appropriate emojis and hashtag recommendations for each.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate caption variations`);
  }
}