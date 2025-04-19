import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
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

  return httpServer;
}
