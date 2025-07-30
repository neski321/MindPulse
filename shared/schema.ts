import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password"),
  name: text("name").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  firebaseUid: text("firebase_uid").unique(),
  isGuest: boolean("is_guest").default(false),
});

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  mood: text("mood").notNull(), // joy, calm, neutral, stressed, anxious
  intensity: integer("intensity").notNull(), // 1-5 scale
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interventions = pgTable("interventions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // breathing, cbt, meditation, custom
  title: text("title").notNull(),
  content: text("content").notNull(),
  duration: integer("duration").notNull(), // minutes
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  anonymous: boolean("anonymous").default(true),
  likes: integer("likes").default(0),
  flagged: boolean("flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Step 1: Define postComments without parentCommentId
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  anonymous: boolean("anonymous").default(true),
  parentCommentId: integer("parent_comment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  streak: integer("streak").default(0),
  totalInterventions: integer("total_interventions").default(0),
  lastCheckIn: timestamp("last_check_in"),
  weeklyMoodData: jsonb("weekly_mood_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  moodEntries: many(moodEntries),
  interventions: many(interventions),
  communityPosts: many(communityPosts),
  postComments: many(postComments),
  progress: one(userProgress),
}));

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, { fields: [moodEntries.userId], references: [users.id] }),
}));

export const interventionsRelations = relations(interventions, ({ one }) => ({
  user: one(users, { fields: [interventions.userId], references: [users.id] }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  user: one(users, { fields: [communityPosts.userId], references: [users.id] }),
  comments: many(postComments),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(communityPosts, { fields: [postComments.postId], references: [communityPosts.id] }),
  user: one(users, { fields: [postComments.userId], references: [users.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
}));

// New tables for recommendations
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  preferredInterventionTypes: jsonb("preferred_intervention_types"), // ["breathing", "meditation", "cbt"]
  preferredContentTypes: jsonb("preferred_content_types"), // ["articles", "audio", "video"]
  preferredDuration: integer("preferred_duration"), // minutes
  preferredTimeOfDay: text("preferred_time_of_day"), // "morning", "afternoon", "evening"
  notificationPreferences: jsonb("notification_preferences"), // {"mood_reminders": true, "intervention_suggestions": true}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // "content", "activity", "intervention", "community"
  title: text("title").notNull(),
  description: text("description"),
  contentId: text("content_id"), // ID of the recommended content
  contentType: text("content_type"), // "article", "meditation", "breathing", "community_post"
  reason: text("reason"), // Why this was recommended
  priority: integer("priority").default(1), // 1-5 scale
  shown: boolean("shown").default(false),
  clicked: boolean("clicked").default(false),
  dismissed: boolean("dismissed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const contentMetadata = pgTable("content_metadata", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(), // "article", "meditation", "breathing", "community_post"
  title: text("title").notNull(),
  description: text("description"),
  tags: jsonb("tags"), // ["anxiety", "stress", "sleep", "relationships"]
  targetMoods: jsonb("target_moods"), // ["anxious", "stressed", "calm"]
  duration: integer("duration"), // minutes
  difficulty: text("difficulty"), // "beginner", "intermediate", "advanced"
  popularity: integer("popularity").default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New relations for recommendations
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, { fields: [recommendations.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertInterventionSchema = createInsertSchema(interventions).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertContentMetadataSchema = createInsertSchema(contentMetadata).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type Intervention = typeof interventions.$inferSelect;
export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type ContentMetadata = typeof contentMetadata.$inferSelect;
export type InsertContentMetadata = z.infer<typeof insertContentMetadataSchema>;
