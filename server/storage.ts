import { 
  users, type User, type InsertUser,
  socialAccounts, type SocialAccount, type InsertSocialAccount,
  trendingHashtags, type TrendingHashtag, type InsertTrendingHashtag,
  popularSongs, type PopularSong, type InsertPopularSong,
  bestPostTimes, type BestPostTime, type InsertBestPostTime
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Social accounts
  getSocialAccounts(userId: number): Promise<SocialAccount[]>;
  getSocialAccountByPlatform(userId: number, platform: string): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, update: Partial<SocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;
  
  // Trending data
  getTrendingHashtags(): Promise<TrendingHashtag[]>;
  createTrendingHashtag(hashtag: InsertTrendingHashtag): Promise<TrendingHashtag>;
  
  // Popular songs
  getPopularSongs(): Promise<PopularSong[]>;
  createPopularSong(song: InsertPopularSong): Promise<PopularSong>;
  
  // Best post times
  getBestPostTimes(): Promise<BestPostTime[]>;
  createBestPostTime(time: InsertBestPostTime): Promise<BestPostTime>;
  
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  deleteAllNotifications(userId: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private socialAccountsMap: Map<number, SocialAccount>;
  private trendingHashtagsMap: Map<number, TrendingHashtag>;
  private popularSongsMap: Map<number, PopularSong>;
  private bestPostTimesMap: Map<number, BestPostTime>;
  private notificationsMap: Map<number, Notification>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private socialAccountIdCounter: number;
  private trendingHashtagIdCounter: number;
  private popularSongIdCounter: number;
  private bestPostTimeIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.socialAccountsMap = new Map();
    this.trendingHashtagsMap = new Map();
    this.popularSongsMap = new Map();
    this.bestPostTimesMap = new Map();
    this.notificationsMap = new Map();
    
    this.userIdCounter = 1;
    this.socialAccountIdCounter = 1;
    this.trendingHashtagIdCounter = 1;
    this.popularSongIdCounter = 1;
    this.bestPostTimeIdCounter = 1;
    this.notificationIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed trending data
    this.seedTrendingData();
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }

  // Social accounts
  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccountsMap.values()).filter(
      (account) => account.userId === userId
    );
  }
  
  async getSocialAccountByPlatform(userId: number, platform: string): Promise<SocialAccount | undefined> {
    return Array.from(this.socialAccountsMap.values()).find(
      (account) => account.userId === userId && account.platform === platform
    );
  }
  
  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.socialAccountIdCounter++;
    const newAccount: SocialAccount = { 
      ...account, 
      id,
      tokenExpiry: account.tokenExpiry || new Date(Date.now() + 3600000) // Default 1 hour from now
    };
    this.socialAccountsMap.set(id, newAccount);
    return newAccount;
  }
  
  async updateSocialAccount(id: number, update: Partial<SocialAccount>): Promise<SocialAccount> {
    const account = this.socialAccountsMap.get(id);
    if (!account) {
      throw new Error("Social account not found");
    }
    
    const updatedAccount = { ...account, ...update };
    this.socialAccountsMap.set(id, updatedAccount);
    return updatedAccount;
  }
  
  async deleteSocialAccount(id: number): Promise<void> {
    this.socialAccountsMap.delete(id);
  }
  
  // Trending hashtags
  async getTrendingHashtags(): Promise<TrendingHashtag[]> {
    return Array.from(this.trendingHashtagsMap.values());
  }
  
  async createTrendingHashtag(hashtag: InsertTrendingHashtag): Promise<TrendingHashtag> {
    const id = this.trendingHashtagIdCounter++;
    const newHashtag: TrendingHashtag = {
      ...hashtag,
      id,
      createdAt: new Date()
    };
    this.trendingHashtagsMap.set(id, newHashtag);
    return newHashtag;
  }
  
  // Popular songs
  async getPopularSongs(): Promise<PopularSong[]> {
    return Array.from(this.popularSongsMap.values());
  }
  
  async createPopularSong(song: InsertPopularSong): Promise<PopularSong> {
    const id = this.popularSongIdCounter++;
    const newSong: PopularSong = {
      ...song,
      id,
      createdAt: new Date()
    };
    this.popularSongsMap.set(id, newSong);
    return newSong;
  }
  
  // Best post times
  async getBestPostTimes(): Promise<BestPostTime[]> {
    return Array.from(this.bestPostTimesMap.values());
  }
  
  async createBestPostTime(time: InsertBestPostTime): Promise<BestPostTime> {
    const id = this.bestPostTimeIdCounter++;
    const newTime: BestPostTime = {
      ...time,
      id,
      createdAt: new Date()
    };
    this.bestPostTimesMap.set(id, newTime);
    return newTime;
  }
  
  // Seed initial trending data
  private seedTrendingData() {
    // Seed trending hashtags
    const hashtags: InsertTrendingHashtag[] = [
      { tag: '#SummerVibes', growth: 127, category: 'Lifestyle' },
      { tag: '#FitnessGoals', growth: 89, category: 'Health' },
      { tag: '#TechTalk', growth: 78, category: 'Technology' },
      { tag: '#FoodieLife', growth: 63, category: 'Food' },
      { tag: '#TravelDreams', growth: 45, category: 'Travel' }
    ];
    
    // Seed popular songs
    const songs: InsertPopularSong[] = [
      { title: 'Summer Beats', artist: 'DJ Sunshine', uses: '1.2M', platform: 'TikTok' },
      { title: 'Dance With Me', artist: 'Groove Masters', uses: '985K', platform: 'Instagram' },
      { title: 'Viral Symphony', artist: 'The Trending', uses: '754K', platform: 'TikTok' },
      { title: 'Feel the Rhythm', artist: 'Beat Makers', uses: '612K', platform: 'TikTok' }
    ];
    
    // Seed best post times
    const postTimes: InsertBestPostTime[] = [
      { day: 'Monday', time: '6:00 PM - 8:00 PM', engagement: 'High' },
      { day: 'Wednesday', time: '12:00 PM - 2:00 PM', engagement: 'Medium' },
      { day: 'Friday', time: '9:00 AM - 11:00 AM', engagement: 'High' },
      { day: 'Saturday', time: '8:00 PM - 10:00 PM', engagement: 'Very High' }
    ];
    
    // Add the seed data
    hashtags.forEach(hashtag => this.createTrendingHashtag(hashtag));
    songs.forEach(song => this.createPopularSong(song));
    postTimes.forEach(time => this.createBestPostTime(time));
  }
}

export const storage = new MemStorage();
