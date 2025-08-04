import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMoodEntrySchema, 
  insertInterventionSchema,
  insertCommunityPostSchema,
  insertPostCommentSchema 
} from "@shared/schema";
import { 
  generatePersonalizedIntervention, 
  generateCBTPrompt, 
  analyzeMoodPattern,
  moderateContent 
} from "./services/gemini";
import { recommendationEngine } from "./services/recommendations";
import { emailService } from "./services/email";

// Helper function for error handling
function handleError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Firebase Auth user sync
  app.post("/api/users/firebase", async (req, res) => {
    try {
      const { firebaseUid, email, name } = req.body;
      if (!firebaseUid) return res.status(400).json({ error: "Missing firebaseUid" });
      let user = await storage.getUserByEmail(email);
      if (!user) {
        // Create new user
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        const displayName = trimmedName !== '' ? trimmedName : email ? email.split("@")[0] : "Firebase User";
        user = await storage.createUser({
          name: displayName,
          username: displayName,
          email: email || `firebase_${firebaseUid}@example.com`,
          firebaseUid,
          isGuest: false
        });
      } else {
        // Update user with firebaseUid if not set
        if (!user.firebaseUid) {
          user = await storage.updateUser(user.id, { firebaseUid });
        }
      }
      res.json({ user: { id: user.id, name: user.name, username: user.username, email: user.email, isGuest: false, firebaseUid } });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Guest user creation
  app.post("/api/users/guest", async (req, res) => {
    try {
      // Create a guest user (no email, random name)
      const guestName = `Guest${Math.floor(Math.random() * 100000)}`;
      const user = await storage.createUser({
        name: guestName,
        username: guestName,
        password: Math.random().toString(36).slice(-8),
        isGuest: true
      });
      res.json({ user: { id: user.id, name: user.name, isGuest: true } });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Delete user and all related data
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      console.log("[Delete User] Attempting to delete user:", userId);
      await storage.deleteUserAndData(userId);
      const deleted = await storage.getUser(userId);
      if (deleted) {
        console.error("[Delete User] User still exists after delete:", deleted);
        return res.status(500).json({ error: "User was not deleted from database." });
      }
      console.log("[Delete User] User deleted successfully:", userId);
      res.json({ success: true });
    } catch (error) {
      console.error("[Delete User] Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Update user profile or password
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, username, password, oldPassword, firebaseUid } = req.body;
      
      // If password is being changed, require oldPassword and check it
      if (password) {
        const user = await storage.getUser(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.password && user.password !== oldPassword) {
          return res.status(400).json({ error: "Old password is incorrect" });
        }
      }
      
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (username) updates.username = username;
      if (password) updates.password = password;
      
      const updatedUser = await storage.updateUser(userId, updates);
      
      // Return the updated user with all necessary fields
      res.json({ 
        user: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          username: updatedUser.username,
          isGuest: updatedUser.isGuest,
          firebaseUid: updatedUser.firebaseUid
        } 
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Update user profile with Firebase email update
  app.patch("/api/users/:id/profile", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, username, firebaseUid } = req.body;
      
      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      
      // Check if email is already taken by another user
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email is already taken by another user" });
      }
      
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (username) updates.username = username;
      
      const updatedUser = await storage.updateUser(userId, updates);
      
      res.json({ 
        user: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          username: updatedUser.username,
          isGuest: updatedUser.isGuest,
          firebaseUid: updatedUser.firebaseUid
        } 
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Mood tracking routes
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const moodData = insertMoodEntrySchema.parse(req.body);
      const moodEntry = await storage.createMoodEntry(moodData);
      
      // Generate personalized intervention recommendation
      const recentMoods = await storage.getUserMoodEntries(moodData.userId, 5);
      const user = await storage.getUser(moodData.userId);
      
      if (user) {
        const intervention = await generatePersonalizedIntervention(
          moodData.mood,
          moodData.intensity,
          recentMoods.map(m => m.mood),
          user.name
        );
        
        res.json({ moodEntry, recommendation: intervention });
      } else {
        res.json({ moodEntry });
      }
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const entries = await storage.getUserMoodEntries(userId, 30);
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.get("/api/mood-entries/:userId/weekly", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const entries = await storage.getWeeklyMoodData(userId);
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Intervention routes
  app.post("/api/interventions", async (req, res) => {
    try {
      const interventionData = insertInterventionSchema.parse(req.body);
      const intervention = await storage.createIntervention(interventionData);
      res.json({ intervention });
    } catch (error) {
      res.status(400).json({ error: handleError(error) });
    }
  });

  app.get("/api/interventions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const interventions = await storage.getUserInterventions(userId);
      res.json({ interventions });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.patch("/api/interventions/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const intervention = await storage.completeIntervention(id);
      res.json({ intervention });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Generate personalized intervention
  app.post("/api/interventions/generate", async (req, res) => {
    try {
      const { userId, mood, intensity } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const recentMoods = await storage.getUserMoodEntries(userId, 5);
      const intervention = await generatePersonalizedIntervention(
        mood,
        intensity,
        recentMoods.map(m => m.mood),
        user.name
      );

      res.json({ intervention });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Generate CBT prompt
  app.post("/api/cbt-prompt", async (req, res) => {
    try {
      const { userId, mood, intensity } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const prompt = await generateCBTPrompt(mood, intensity, user.name);
      res.json({ prompt });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      // Get mood pattern analysis
      const moodHistory = await storage.getUserMoodEntries(userId, 30);
      const moodData = moodHistory.map(entry => ({
        mood: entry.mood,
        intensity: entry.intensity,
        date: entry.createdAt || new Date()
      }));

      const insights = await analyzeMoodPattern(moodData);
      
      res.json({ progress, insights });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/progress/:userId/streak", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.incrementStreak(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Community routes
  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      
      // Moderate content
      const moderation = await moderateContent(postData.content);
      if (!moderation.safe) {
        return res.status(400).json({ 
          error: "Content violates community guidelines", 
          reason: moderation.reason 
        });
      }

      const post = await storage.createCommunityPost(postData);
      res.json({ post });
    } catch (error) {
      res.status(400).json({ error: handleError(error) });
    }
  });

  app.get("/api/community/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await storage.getCommunityPosts(limit);
      res.json({ posts });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/community/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      await storage.likePost(postId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const commentData = insertPostCommentSchema.parse({
        ...req.body,
        postId,
        parentCommentId: req.body.parentCommentId ?? null,
      });

      // Moderate content
      const moderation = await moderateContent(commentData.content);
      if (!moderation.safe) {
        return res.status(400).json({ 
          error: "Content violates community guidelines", 
          reason: moderation.reason 
        });
      }

      const comment = await storage.createPostComment(commentData);
      res.json({ comment });
    } catch (error) {
      res.status(400).json({ error: handleError(error) });
    }
  });

  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getPostComments(postId);
      res.json({ comments });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Delete a community post (only by the author)
  app.delete("/api/community/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const post = await storage.getCommunityPost(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.userId !== userId) {
        return res.status(403).json({ error: "You can only delete your own posts" });
      }

      await storage.deleteCommunityPost(postId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Delete a comment (only by the author)
  app.delete("/api/community/comments/:id", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const comment = await storage.getPostComment(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "You can only delete your own comments" });
      }

      await storage.deletePostComment(commentId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Crisis resources
  app.get("/api/crisis-resources", async (req, res) => {
    try {
      const resources = [
        {
          name: "National Suicide Prevention Lifeline",
          phone: "988",
          text: "Text HOME to 741741",
          available: "24/7",
          description: "Free and confidential support for people in distress"
        },
        {
          name: "Crisis Text Line",
          phone: null,
          text: "Text HELLO to 741741",
          available: "24/7",
          description: "Free, 24/7 support for those in crisis"
        },
        {
          name: "SAMHSA National Helpline",
          phone: "1-800-662-4357",
          text: null,
          available: "24/7",
          description: "Treatment referral and information service"
        }
      ];
      
      res.json({ resources });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Recommendation routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await recommendationEngine.generateRecommendations(userId);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/recommendations/:userId/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = req.body;
      await recommendationEngine.updateUserPreferences(userId, preferences);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/recommendations/:id/interaction", async (req, res) => {
    try {
      const recommendationId = req.params.id;
      const { action } = req.body; // 'clicked' or 'dismissed'
      
      if (!['clicked', 'dismissed'].includes(action)) {
        return res.status(400).json({ error: "Invalid action" });
      }
      
      // Handle both numeric IDs (from database) and string IDs (fallback)
      const parsedId = isNaN(parseInt(recommendationId)) ? recommendationId : parseInt(recommendationId);
      
      await recommendationEngine.trackRecommendationInteraction(parsedId, action);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Contact support routes
  app.post("/api/contact-support", async (req, res) => {
    try {
      const { name, email, subject, message, priority, userId } = req.body;
      
      if (!name || !email || !subject || !message || !priority) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const contactMessage = await storage.createContactSupportMessage({
        name,
        email,
        subject,
        message,
        priority,
        userId: userId ? parseInt(userId) : null,
      });

      res.json({ message: contactMessage });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  // Admin routes for contact message management
  app.get("/api/admin/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.get("/api/admin/contact-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getContactMessageById(id);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.patch("/api/admin/contact-messages/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const message = await storage.updateContactMessageStatus(id, status);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.delete("/api/admin/contact-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContactMessage(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  app.post("/api/admin/contact-messages/:id/reply", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { replyMessage } = req.body;
      
      if (!replyMessage) {
        return res.status(400).json({ error: "Reply message is required" });
      }
      
      const message = await storage.getContactMessageById(id);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      // Send email reply
      const emailSent = await emailService.sendReplyEmail({
        to: message.email,
        fromName: message.name,
        originalSubject: message.subject,
        originalMessage: message.message,
        replyMessage: replyMessage.trim(),
      });
      
      // Update message status to resolved
      const updatedMessage = await storage.updateContactMessageStatus(id, "resolved");
      
      res.json({ 
        message: updatedMessage,
        emailSent,
        note: emailSent ? "Reply sent successfully" : "Failed to send email, but status updated"
      });
    } catch (error) {
      res.status(500).json({ error: handleError(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
