# SocialPulse - Social Media Dashboard

A comprehensive social media dashboard that aggregates metrics from multiple platforms with OpenAI-powered trend analysis.

## Features

- **Multi-Platform Integration**: Connect and monitor metrics from TikTok, Instagram, YouTube, Facebook, X, Kwai, and Pinterest
- **Real-Time Notifications**: Get alerts about important changes in your social media metrics
- **AI-Powered Insights**: Leverage OpenAI to analyze trends, suggest optimal posting times, and generate content ideas
- **Content Creator Tools**: Generate platform-optimized captions, hashtags, and content ideas
- **Comprehensive Analytics**: View detailed performance metrics across all connected platforms

## Tech Stack

- **Frontend**: React with Shadcn UI components
- **Backend**: Node.js with Express
- **Authentication**: Local and social media login options
- **Real-Time Updates**: WebSocket integration
- **AI Integration**: OpenAI API for content suggestions and trend analysis

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at http://localhost:5000

## Environment Variables

The application requires the following environment variables:

- `OPENAI_API_KEY`: API key for OpenAI integration
- `SESSION_SECRET`: Secret for session management
- (Additional platform-specific API keys as needed)

## License

[MIT License](LICENSE)