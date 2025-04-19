import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'sk-yourapikey' 
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

    // Parse and return the response
    return JSON.parse(response.choices[0].message.content);
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

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to get content recommendations for ${platform}`);
  }
}

export async function generateContent(contentType: string, description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator specializing in creating engaging content."
        },
        {
          role: "user",
          content: `Generate ${contentType} based on this description: "${description}". For hashtags, include a set of 10-15 relevant tags. For captions, write something engaging with emojis. For content ideas, suggest 5 specific post concepts.`
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate ${contentType}`);
  }
}
