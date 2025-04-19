import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(), // facebook, instagram, tiktok, etc.
  connected: boolean("connected").notNull().default(true),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  username: text("username"),
  followers: integer("followers").default(0),
  engagement: text("engagement").default("0"),
  posts: integer("posts").default(0),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
});

export const trendingHashtags = pgTable("trending_hashtags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  growth: integer("growth").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrendingHashtagSchema = createInsertSchema(trendingHashtags).omit({
  id: true,
  createdAt: true,
});

export const popularSongs = pgTable("popular_songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  uses: text("uses").notNull(),
  platform: text("platform").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPopularSongSchema = createInsertSchema(popularSongs).omit({
  id: true,
  createdAt: true,
});

export const bestPostTimes = pgTable("best_post_times", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  time: text("time").notNull(),
  engagement: text("engagement").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBestPostTimeSchema = createInsertSchema(bestPostTimes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;

export type InsertTrendingHashtag = z.infer<typeof insertTrendingHashtagSchema>;
export type TrendingHashtag = typeof trendingHashtags.$inferSelect;

export type InsertPopularSong = z.infer<typeof insertPopularSongSchema>;
export type PopularSong = typeof popularSongs.$inferSelect;

export type InsertBestPostTime = z.infer<typeof insertBestPostTimeSchema>;
export type BestPostTime = typeof bestPostTimes.$inferSelect;

// Notification schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'info', 'success', 'warning', 'error'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
