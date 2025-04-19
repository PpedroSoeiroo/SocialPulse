import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { getTrendingContent, getContentRecommendations, generateContent } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Get social accounts for current user
  app.get("/api/social-accounts", isAuthenticated, async (req, res, next) => {
    try {
      const accounts = await storage.getSocialAccounts(req.user!.id);
      res.json(accounts);
    } catch (error) {
      next(error);
    }
  });

  // Connect a new social account
  app.post("/api/social-accounts", isAuthenticated, async (req, res, next) => {
    try {
      const newAccount = await storage.createSocialAccount({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  });

  // Update a social account
  app.patch("/api/social-accounts/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const updatedAccount = await storage.updateSocialAccount(id, req.body);
      res.json(updatedAccount);
    } catch (error) {
      next(error);
    }
  });

  // Delete a social account
  app.delete("/api/social-accounts/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialAccount(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Get trending hashtags
  app.get("/api/trending-hashtags", isAuthenticated, async (req, res, next) => {
    try {
      const hashtags = await storage.getTrendingHashtags();
      res.json(hashtags);
    } catch (error) {
      next(error);
    }
  });

  // Get popular songs
  app.get("/api/popular-songs", isAuthenticated, async (req, res, next) => {
    try {
      const songs = await storage.getPopularSongs();
      res.json(songs);
    } catch (error) {
      next(error);
    }
  });

  // Get best post times
  app.get("/api/best-post-times", isAuthenticated, async (req, res, next) => {
    try {
      const times = await storage.getBestPostTimes();
      res.json(times);
    } catch (error) {
      next(error);
    }
  });

  // Get AI-generated trending content (hashtags, songs, post times)
  app.get("/api/ai/trending-content", isAuthenticated, async (req, res, next) => {
    try {
      const trendingContent = await getTrendingContent();
      res.json(trendingContent);
    } catch (error) {
      next(error);
    }
  });

  // Get content recommendations for a specific platform
  app.get("/api/ai/content-recommendations/:platform", isAuthenticated, async (req, res, next) => {
    try {
      const platform = req.params.platform;
      const recommendations = await getContentRecommendations(platform);
      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  // Generate content using AI
  app.post("/api/ai/generate-content", isAuthenticated, async (req, res, next) => {
    try {
      const { contentType, description } = req.body;
      if (!contentType || !description) {
        return res.status(400).json({ message: "Content type and description are required" });
      }
      
      const generatedContent = await generateContent(contentType, description);
      res.json({ content: generatedContent });
    } catch (error) {
      next(error);
    }
  });

  // Get dashboard data (combine multiple endpoints for efficiency)
  app.get("/api/dashboard", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user!.id;
      
      // Get all data in parallel
      const [accounts, hashtags, songs, times] = await Promise.all([
        storage.getSocialAccounts(userId),
        storage.getTrendingHashtags(),
        storage.getPopularSongs(),
        storage.getBestPostTimes()
      ]);
      
      res.json({
        socialAccounts: accounts,
        trendingHashtags: hashtags,
        popularSongs: songs,
        bestPostTimes: times
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Map to store client connections by user ID
  const clients = new Map<number, WebSocket[]>();

  // Type for WebSocket messages
  type WebSocketAuthMessage = {
    type: 'auth';
    userId: number;
  };
  
  // Helper function to ensure value is a number for TypeScript
  function ensureNumber(value: number | null): asserts value is number {
    if (value === null) {
      throw new Error("Expected a number but got null");
    }
  }

  wss.on('connection', (ws: WebSocket) => {
    let wsUserId: number | null = null;
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle client authentication
        if (data.type === 'auth' && typeof data.userId === 'number') {
          const userId = data.userId;  // Create a constant with the correct type
          wsUserId = userId;
          
          // Store client connection
          const existingConnections = clients.get(userId) || [];
          existingConnections.push(ws);
          clients.set(userId, existingConnections);
          
          // Send a welcome notification
          ws.send(JSON.stringify({
            type: 'notification',
            notification: {
              id: Date.now(),
              title: 'Connected',
              message: 'You are now receiving real-time notifications',
              type: 'info',
              timestamp: new Date().toISOString()
            }
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      if (wsUserId !== null) {
        const userId = wsUserId; // Create a local constant
        
        // Remove this client from the connections list
        const userClients = clients.get(userId);
        if (userClients) {
          const index = userClients.indexOf(ws);
          if (index !== -1) {
            userClients.splice(index, 1);
          }
          
          // Clean up if no more connections for this user
          if (userClients.length === 0) {
            clients.delete(userId);
          }
        }
      }
    });
  });
  
  // Helper function to send notifications to a specific user
  const sendNotification = (userId: number, notification: {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
  }) => {
    if (clients.has(userId)) {
      const userClients = clients.get(userId)!;
      
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'notification',
            notification
          }));
        }
      });
    }
  };
  
  // Endpoint to get notifications for a user
  app.get("/api/notifications", isAuthenticated, (req, res) => {
    // In a real implementation, we would fetch from database
    // For now, return empty array as we're using WebSockets for real-time
    res.json([]);
  });
  
  // Endpoint to manually send a test notification
  app.post("/api/notifications/test", isAuthenticated, (req, res) => {
    const userId = req.user!.id;
    const { title, message, type } = req.body;
    
    const notification = {
      id: Date.now(),
      title: title || "Test Notification",
      message: message || "This is a test notification from the server.",
      type: type || "info",
      timestamp: new Date().toISOString()
    };
    
    sendNotification(userId, notification);
    res.status(201).json(notification);
  });
  
  // Make the sendNotification function available to other modules
  (app as any).sendNotification = sendNotification;

  return httpServer;
}
