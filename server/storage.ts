import { 
  users, 
  moodEntries, 
  interventions, 
  communityPosts, 
  postComments, 
  userProgress,
  contactSupportMessages,
  type User, 
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type Intervention,
  type InsertIntervention,
  type CommunityPost,
  type InsertCommunityPost,
  type PostComment,
  type InsertPostComment,
  type UserProgress,
  type InsertUserProgress,
  type ContactSupportMessage,
  type InsertContactSupportMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Mood tracking operations
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodEntries(userId: number, limit?: number): Promise<MoodEntry[]>;
  getWeeklyMoodData(userId: number): Promise<MoodEntry[]>;

  // Intervention operations
  createIntervention(intervention: InsertIntervention): Promise<Intervention>;
  getUserInterventions(userId: number): Promise<Intervention[]>;
  completeIntervention(id: number): Promise<Intervention>;

  // Community operations
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getCommunityPosts(limit?: number): Promise<(CommunityPost & { replyCount: number })[]>;
  likePost(postId: number): Promise<void>;
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  getPostComments(postId: number): Promise<PostComment[]>;

  // Progress operations
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  incrementStreak(userId: number): Promise<void>;

  // Contact support operations
  createContactSupportMessage(message: InsertContactSupportMessage): Promise<ContactSupportMessage>;
  
  // Admin operations for contact messages
  getAllContactMessages(): Promise<ContactSupportMessage[]>;
  getContactMessageById(id: number): Promise<ContactSupportMessage | undefined>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactSupportMessage>;
  deleteContactMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    
    // Create initial progress record
    await db.insert(userProgress).values({
      userId: user.id,
      streak: 0,
      totalInterventions: 0,
      weeklyMoodData: {},
    });
    
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [moodEntry] = await db.insert(moodEntries).values(entry).returning();
    
    // Update user progress
    await this.updateLastCheckIn(entry.userId);
    
    return moodEntry;
  }

  async getUserMoodEntries(userId: number, limit: number = 10): Promise<MoodEntry[]> {
    return await db.select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(limit);
  }

  async getWeeklyMoodData(userId: number): Promise<MoodEntry[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db.select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.createdAt, oneWeekAgo)
        )
      )
      .orderBy(desc(moodEntries.createdAt));
  }

  async createIntervention(intervention: InsertIntervention): Promise<Intervention> {
    const [result] = await db.insert(interventions).values(intervention).returning();
    return result;
  }

  async getUserInterventions(userId: number): Promise<Intervention[]> {
    return await db.select()
      .from(interventions)
      .where(eq(interventions.userId, userId))
      .orderBy(desc(interventions.createdAt));
  }

  async completeIntervention(id: number): Promise<Intervention> {
    const [intervention] = await db.update(interventions)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(interventions.id, id))
      .returning();
    
    // Update user progress
    if (intervention) {
      await this.incrementTotalInterventions(intervention.userId);
    }
    
    return intervention;
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [result] = await db.insert(communityPosts).values(post).returning();
    return result;
  }

  async getCommunityPosts(limit: number = 10): Promise<(CommunityPost & { replyCount: number })[]> {
    const posts = await db.select({
      id: communityPosts.id,
      userId: communityPosts.userId,
      content: communityPosts.content,
      anonymous: communityPosts.anonymous,
      likes: communityPosts.likes,
      flagged: communityPosts.flagged,
      createdAt: communityPosts.createdAt,
      replyCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${postComments} 
        WHERE ${postComments.postId} = ${communityPosts.id}
      )`
    })
      .from(communityPosts)
      .where(eq(communityPosts.flagged, false))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
    
    return posts;
  }

  async likePost(postId: number): Promise<void> {
    await db.update(communityPosts)
      .set({ likes: sql`${communityPosts.likes} + 1` })
      .where(eq(communityPosts.id, postId));
  }

  async createPostComment(comment: InsertPostComment): Promise<PostComment> {
    const [result] = await db.insert(postComments).values(comment).returning();
    return result;
  }

  async getPostComments(postId: number): Promise<PostComment[]> {
    return await db.select()
      .from(postComments)
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt));
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress || undefined;
  }

  async updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [result] = await db.update(userProgress)
      .set({ ...progress, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return result;
  }

  async incrementStreak(userId: number): Promise<void> {
    await db.update(userProgress)
      .set({ 
        streak: sql`${userProgress.streak} + 1`,
        updatedAt: new Date()
      })
      .where(eq(userProgress.userId, userId));
  }

  async deleteUserAndData(userId: number): Promise<void> {
    // Delete all related data
    await db.delete(postComments).where(eq(postComments.userId, userId));
    await db.delete(communityPosts).where(eq(communityPosts.userId, userId));
    await db.delete(moodEntries).where(eq(moodEntries.userId, userId));
    await db.delete(interventions).where(eq(interventions.userId, userId));
    await db.delete(userProgress).where(eq(userProgress.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  }

  private async updateLastCheckIn(userId: number): Promise<void> {
    await db.update(userProgress)
      .set({ lastCheckIn: new Date(), updatedAt: new Date() })
      .where(eq(userProgress.userId, userId));
  }

  private async incrementTotalInterventions(userId: number): Promise<void> {
    await db.update(userProgress)
      .set({ 
        totalInterventions: sql`${userProgress.totalInterventions} + 1`,
        updatedAt: new Date()
      })
      .where(eq(userProgress.userId, userId));
  }

  async createContactSupportMessage(message: InsertContactSupportMessage): Promise<ContactSupportMessage> {
    const [result] = await db.insert(contactSupportMessages).values(message).returning();
    return result;
  }

  async getAllContactMessages(): Promise<ContactSupportMessage[]> {
    return await db.select()
      .from(contactSupportMessages)
      .orderBy(desc(contactSupportMessages.createdAt));
  }

  async getContactMessageById(id: number): Promise<ContactSupportMessage | undefined> {
    const [message] = await db.select()
      .from(contactSupportMessages)
      .where(eq(contactSupportMessages.id, id));
    return message || undefined;
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactSupportMessage> {
    const [message] = await db.update(contactSupportMessages)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(contactSupportMessages.id, id))
      .returning();
    return message;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactSupportMessages)
      .where(eq(contactSupportMessages.id, id));
  }
}

export const storage = new DatabaseStorage();
