import { db } from "../db";
import { users, moodEntries, interventions, userPreferences, recommendations as recommendationsTable, contentMetadata, communityPosts } from "../../shared/schema";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { generatePersonalizedIntervention, generateCrisisIntervention } from "./gemini";
import { Recommendation } from "../../shared/schema";

export interface RecommendationEngine {
  generateRecommendations(userId: number): Promise<Recommendation[]>;
  updateUserPreferences(userId: number, preferences: any): Promise<void>;
  trackRecommendationInteraction(recommendationId: number | string, action: 'clicked' | 'dismissed'): Promise<void>;
}

export class PersonalizedRecommendationEngine implements RecommendationEngine {
  
  async generateRecommendations(userId: number): Promise<any[]> {
    try {
      // Get user data
      const userData = await this.getUserData(userId);
      const moodPatterns = await this.getMoodPatterns(userId);
      const userPrefs = await this.getUserPreferences(userId);
      
      // Check if user has logged mood for at least 2 consecutive days
      const hasConsecutiveMoodLogs = await this.checkConsecutiveMoodLogs(userId);
      console.log(`User ${userId} consecutive mood logs check:`, hasConsecutiveMoodLogs);
      if (!hasConsecutiveMoodLogs) {
        console.log(`User ${userId} doesn't have consecutive mood logs, returning empty recommendations`);
        return []; // Return empty array if user hasn't logged mood for 2 consecutive days
      }
      
      // Get existing recommendations that haven't been dismissed
      const existingRecommendations = await db
        .select()
        .from(recommendationsTable)
        .where(
          and(
            eq(recommendationsTable.userId, userId),
            eq(recommendationsTable.dismissed, false),
            gte(recommendationsTable.expiresAt, new Date())
          )
        )
        .orderBy(desc(recommendationsTable.priority));
      
      // If we have enough non-dismissed recommendations, return them
      if (existingRecommendations.length >= 12) {
        return existingRecommendations.slice(0, 12);
      }
      
      // Track used contentIds to avoid duplicates
      const usedContentIds = new Set(existingRecommendations.map(rec => rec.contentId));
      
      // Generate different types of recommendations
      const recommendations = [];
      
      // 1. Mood-based intervention recommendations
      const moodRecommendations = await this.generateMoodBasedRecommendations(userData, moodPatterns);
      recommendations.push(...moodRecommendations);
      
      // 2. Activity recommendations based on patterns
      const activityRecommendations = await this.generateActivityRecommendations(userData, moodPatterns);
      recommendations.push(...activityRecommendations);
      
      // 3. Content recommendations
      const contentRecommendations = await this.generateContentRecommendations(userData, userPrefs);
      recommendations.push(...contentRecommendations);
      
      // 4. Community recommendations
      const communityRecommendations = await this.generateCommunityRecommendations(userData, moodPatterns);
      recommendations.push(...communityRecommendations);
      
      // Sort by priority and filter out duplicates
      const uniqueRecommendations = recommendations
        .filter(rec => !usedContentIds.has(rec.contentId))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 12 - existingRecommendations.length);
      
      // Save unique recommendations to database
      const savedRecommendations = [];
      for (const rec of uniqueRecommendations) {
        const savedRec = await this.saveRecommendationToDatabase(userId, rec);
        savedRecommendations.push(savedRec);
      }
      
      // Combine existing and new recommendations
      const allRecommendations = [...existingRecommendations, ...savedRecommendations];
      
      return allRecommendations.slice(0, 12);
        
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }

  private async getUserData(userId: number) {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const recentMoods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(7);
    
    const recentInterventions = await db
      .select()
      .from(interventions)
      .where(eq(interventions.userId, userId))
      .orderBy(desc(interventions.createdAt))
      .limit(10);
    
    return {
      user: user[0],
      recentMoods,
      recentInterventions
    };
  }

  private async getMoodPatterns(userId: number) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const moodHistory = await db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.createdAt, last30Days)
        )
      )
      .orderBy(desc(moodEntries.createdAt));
    
    // Analyze patterns
    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageIntensity = moodHistory.length > 0 
      ? moodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / moodHistory.length 
      : 3;
    
    const mostFrequentMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
    
    return {
      moodHistory,
      moodCounts,
      averageIntensity,
      mostFrequentMood,
      totalEntries: moodHistory.length
    };
  }

  private async getUserPreferences(userId: number) {
    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    
    return prefs[0] || {
      preferredInterventionTypes: ['breathing', 'meditation'],
      preferredContentTypes: ['articles', 'audio'],
      preferredDuration: 5,
      preferredTimeOfDay: 'morning',
      notificationPreferences: {
        mood_reminders: true,
        intervention_suggestions: true
      }
    };
  }

  private async generateMoodBasedRecommendations(userData: any, moodPatterns: any) {
    const recommendations = [];
    const currentTime = new Date();
    const hour = currentTime.getHours();
    
    // Get current mood or most recent mood
    const currentMood = userData.recentMoods[0]?.mood || moodPatterns.mostFrequentMood;
    const currentSecondaryMood = userData.recentMoods[0]?.secondaryMood;
    const currentIntensity = userData.recentMoods[0]?.intensity || moodPatterns.averageIntensity;
    
    // Morning recommendations (6-11 AM)
    if (hour >= 6 && hour < 11) {
      if (currentMood === 'anxious' || currentMood === 'stressed') {
        recommendations.push({
          type: 'intervention',
          title: 'Morning Calm',
          description: 'Start your day with a gentle breathing exercise to center yourself',
          contentType: 'breathing',
          reason: `Based on your ${currentMood} mood, this morning breathing exercise can help set a positive tone for your day`,
          priority: 5,
          contentId: 'morning-breathing-5min'
        });
      } else if (currentMood === 'joy' || currentMood === 'calm') {
        recommendations.push({
          type: 'intervention',
          title: 'Gratitude Meditation',
          description: 'Build on your positive energy with a gratitude practice',
          contentType: 'meditation',
          reason: 'You\'re feeling great! This gratitude meditation can amplify your positive mood',
          priority: 4,
          contentId: 'gratitude-meditation-3min'
        });
      }
      
      // Add a general morning recommendation
      recommendations.push({
        type: 'intervention',
        title: 'Mindful Morning',
        description: 'A gentle 3-minute mindfulness practice to start your day',
        contentType: 'meditation',
        reason: 'Morning mindfulness can set a positive tone for your entire day',
        priority: 3,
        contentId: 'mindful-morning-3min'
      });
    }
    
    // Afternoon recommendations (12-5 PM)
    if (hour >= 12 && hour < 17) {
      if (currentMood === 'stressed' || currentIntensity > 3) {
        recommendations.push({
          type: 'intervention',
          title: 'Quick Reset',
          description: 'A 2-minute breathing break to help you refocus',
          contentType: 'breathing',
          reason: 'You seem to be experiencing some stress. This quick reset can help you regain focus',
          priority: 5,
          contentId: 'quick-reset-breathing-2min'
        });
      }
      
      // Add afternoon energy boost
      recommendations.push({
        type: 'intervention',
        title: 'Energy Boost',
        description: 'A quick 2-minute energizing breathing exercise',
        contentType: 'breathing',
        reason: 'Afternoon energy dip? This quick exercise can help you feel more alert',
        priority: 3,
        contentId: 'energy-boost-2min'
      });
    }
    
    // Evening recommendations (6-11 PM)
    if (hour >= 18 && hour < 23) {
      if (currentMood === 'anxious' || currentMood === 'stressed') {
        recommendations.push({
          type: 'intervention',
          title: 'Evening Wind-Down',
          description: 'Gentle meditation to help you relax before sleep',
          contentType: 'meditation',
          reason: 'Help yourself unwind from the day with this calming evening practice',
          priority: 4,
          contentId: 'evening-wind-down-5min'
        });
      }
      
      // Add evening relaxation
      recommendations.push({
        type: 'intervention',
        title: 'Progressive Relaxation',
        description: 'Release tension with this guided muscle relaxation',
        contentType: 'meditation',
        reason: 'Perfect for unwinding after a busy day',
        priority: 3,
        contentId: 'progressive-relaxation-5min'
      });
    }
    
    // Add general recommendations based on mood
    if (currentMood === 'anxious') {
      recommendations.push({
        type: 'intervention',
        title: 'Anxiety Relief',
        description: 'A specialized breathing technique for anxiety',
        contentType: 'breathing',
        reason: 'This technique is specifically designed to help with anxiety symptoms',
        priority: 4,
        contentId: 'anxiety-relief-breathing-4min'
      });
    }
    
    if (currentMood === 'stressed') {
      recommendations.push({
        type: 'intervention',
        title: 'Stress Release',
        description: 'A 4-minute stress relief breathing pattern',
        contentType: 'breathing',
        reason: 'This pattern helps activate your body\'s natural relaxation response',
        priority: 4,
        contentId: 'stress-release-4min'
      });
    }

    // Enhanced recommendations using secondary mood data
    if (currentSecondaryMood) {
      // Crisis prevention for overwhelmed users
      if (currentMood === 'stressed' && currentSecondaryMood === 'overwhelmed') {
        recommendations.push({
          type: 'intervention',
          title: 'Crisis Safety Planning',
          description: 'Create a personalized safety plan for overwhelming moments',
          contentType: 'cbt',
          reason: 'Feeling overwhelmed can be challenging. A safety plan can help you navigate difficult moments.',
          priority: 5,
          contentId: 'crisis-safety-planning'
        });
      }

      // Immediate grounding for panicked users
      if (currentMood === 'anxious' && currentSecondaryMood === 'panicked') {
        recommendations.push({
          type: 'intervention',
          title: 'Immediate Grounding',
          description: 'Quick grounding techniques for acute anxiety',
          contentType: 'grounding',
          reason: 'When feeling panicked, grounding techniques can help you find your center quickly.',
          priority: 5,
          contentId: 'immediate-grounding-2min'
        });
      }

      // Gratitude practice for grateful users
      if (currentMood === 'joy' && currentSecondaryMood === 'grateful') {
        recommendations.push({
          type: 'activity',
          title: 'Gratitude Journal',
          description: 'Build on your grateful feeling with a gratitude practice',
          contentType: 'activity',
          reason: 'Your gratitude is beautiful! This practice can amplify your positive feelings.',
          priority: 4,
          contentId: 'gratitude-journal'
        });
      }

      // Energy channeling for energetic users
      if (currentMood === 'joy' && currentSecondaryMood === 'energetic') {
        recommendations.push({
          type: 'activity',
          title: 'Channel Your Energy',
          description: 'Use your positive energy for a productive activity',
          contentType: 'activity',
          reason: 'Great energy! Channel it into something meaningful.',
          priority: 4,
          contentId: 'energy-channeling'
        });
      }

      // Sleep support for tired users
      if (currentMood === 'neutral' && currentSecondaryMood === 'tired') {
        recommendations.push({
          type: 'intervention',
          title: 'Gentle Sleep Prep',
          description: 'A calming routine to help you rest',
          contentType: 'meditation',
          reason: 'Rest is important. This gentle practice can help you prepare for sleep.',
          priority: 4,
          contentId: 'sleep-prep-5min'
        });
      }
    }
    
    return recommendations;
  }

  private async generateActivityRecommendations(userData: any, moodPatterns: any) {
    const recommendations = [];
    
    // Check if user hasn't tracked mood today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasTrackedToday = userData.recentMoods.some((mood: any) => {
      const moodDate = new Date(mood.createdAt);
      moodDate.setHours(0, 0, 0, 0);
      return moodDate.getTime() === today.getTime();
    });
    
    if (!hasTrackedToday) {
      recommendations.push({
        type: 'activity',
        title: 'How are you feeling?',
        description: 'Take a moment to check in with yourself',
        contentType: 'mood_tracking',
        reason: 'You haven\'t tracked your mood today. Regular check-ins help build self-awareness',
        priority: 5,
        contentId: 'mood-checkin'
      });
    }
    
    // Check intervention patterns
    const completedInterventions = userData.recentInterventions.filter((i: any) => i.completed);
    const lastIntervention = completedInterventions[0];
    
    if (!lastIntervention || this.daysSince(lastIntervention.completedAt) > 2) {
      recommendations.push({
        type: 'activity',
        title: 'Time for a Wellness Break',
        description: 'Take a few minutes for yourself',
        contentType: 'intervention',
        reason: 'It\'s been a while since your last wellness activity. Regular practice builds resilience',
        priority: 4,
        contentId: 'wellness-break-suggestion'
      });
    }
    
    // Streak encouragement
    if (moodPatterns.totalEntries >= 3) {
      const positiveDays = userData.recentMoods.filter((mood: any) => 
        ['joy', 'calm'].includes(mood.mood)
      ).length;
      
      if (positiveDays >= 2) {
        recommendations.push({
          type: 'activity',
          title: 'You\'re on a Roll!',
          description: 'Keep up the great work with your wellness practice',
          contentType: 'encouragement',
          reason: 'You\'ve been feeling positive lately. This is a great time to build on your momentum',
          priority: 3,
          contentId: 'streak-encouragement'
        });
      }
    }
    
    // Add more activity recommendations
    recommendations.push({
      type: 'activity',
      title: 'Mindful Walking',
      description: 'Take a 5-minute mindful walk to clear your mind',
      contentType: 'intervention',
      reason: 'Physical movement combined with mindfulness can help reduce stress and improve mood',
      priority: 3,
      contentId: 'mindful-walking-5min'
    });
    
    recommendations.push({
      type: 'activity',
      title: 'Gratitude Journal',
      description: 'Write down three things you\'re grateful for today',
      contentType: 'activity',
      reason: 'Practicing gratitude has been shown to improve mental well-being and reduce stress',
      priority: 3,
      contentId: 'gratitude-journal'
    });
    
    recommendations.push({
      type: 'activity',
      title: 'Body Scan Meditation',
      description: 'A 3-minute body scan to release tension',
      contentType: 'meditation',
      reason: 'This practice helps you become more aware of physical sensations and release tension',
      priority: 3,
      contentId: 'body-scan-3min'
    });
    
    return recommendations;
  }

  private async generateContentRecommendations(userData: any, userPrefs: any) {
    const recommendations = [];
    
    // Get content metadata for recommendations
    const contentItems = await db
      .select()
      .from(contentMetadata)
      .limit(10);
    
    // Filter by user preferences
    const preferredContent = contentItems.filter(item => 
      userPrefs.preferredContentTypes.includes(item.contentType) ||
      userPrefs.preferredDuration >= (item.duration || 0)
    );
    
    // Recommend based on mood patterns
    const moodPatterns = await this.getMoodPatterns(userData.user.id);
    const targetMood = moodPatterns.mostFrequentMood;
    
    const moodSpecificContent = preferredContent.filter(item => 
      item.targetMoods && Array.isArray(item.targetMoods) && item.targetMoods.includes(targetMood)
    );
    
    if (moodSpecificContent.length > 0) {
      const content = moodSpecificContent[0];
      recommendations.push({
        type: 'content',
        title: content.title,
        description: content.description,
        contentType: content.contentType,
        reason: `Based on your mood patterns, this ${content.contentType} might be helpful`,
        priority: 4,
        contentId: content.contentId
      });
    }
    
    // Add more content recommendations
    recommendations.push({
      type: 'content',
      title: 'Understanding Anxiety',
      description: 'Learn about anxiety symptoms and evidence-based coping strategies',
      contentType: 'article',
      reason: 'Knowledge about anxiety can help you better understand and manage your symptoms',
      priority: 3,
      contentId: 'understanding-anxiety-guide'
    });
    
    recommendations.push({
      type: 'content',
      title: 'Stress Management Techniques',
      description: 'Evidence-based techniques for stress reduction and management',
      contentType: 'article',
      reason: 'Learning stress management techniques can help you build resilience',
      priority: 3,
      contentId: 'stress-management-techniques'
    });
    
    recommendations.push({
      type: 'content',
      title: 'Building Resilience',
      description: 'Practical strategies to strengthen mental resilience and emotional well-being',
      contentType: 'article',
      reason: 'Building resilience helps you better cope with life\'s challenges',
      priority: 3,
      contentId: 'building-resilience-daily'
    });
    
    return recommendations;
  }

  private async generateCommunityRecommendations(userData: any, moodPatterns: any) {
    const recommendations = [];
    
    // Check if user is active in community
    const userPosts = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.userId, userData.user.id))
      .limit(5);
    
    if (userPosts.length === 0) {
      recommendations.push({
        type: 'community',
        title: 'Join the Conversation',
        description: 'Connect with others on similar wellness journeys',
        contentType: 'community_post',
        reason: 'Sharing experiences can provide support and new perspectives',
        priority: 3,
        contentId: 'community-encouragement'
      });
    }
    
    // Recommend community based on mood
    if (moodPatterns.mostFrequentMood === 'anxious' || moodPatterns.mostFrequentMood === 'stressed') {
      recommendations.push({
        type: 'community',
        title: 'You\'re Not Alone',
        description: 'Connect with others who understand what you\'re going through',
        contentType: 'community_support',
        reason: 'Many others are experiencing similar feelings. Community support can help',
        priority: 4,
        contentId: 'anxiety-support-community'
      });
    }
    
    // Add more community recommendations
    recommendations.push({
      type: 'community',
      title: 'Wellness Stories',
      description: 'Read inspiring stories from others on their wellness journey',
      contentType: 'community_content',
      reason: 'Hearing others\' experiences can provide motivation and new perspectives',
      priority: 3,
      contentId: 'wellness-stories'
    });
    
    recommendations.push({
      type: 'community',
      title: 'Daily Check-in',
      description: 'Share your daily wellness progress with the community',
      contentType: 'community_activity',
      reason: 'Regular check-ins help build accountability and connection',
      priority: 3,
      contentId: 'daily-checkin'
    });
    
    recommendations.push({
      type: 'community',
      title: 'Support Group',
      description: 'Join a supportive group for ongoing encouragement',
      contentType: 'community_group',
      reason: 'Being part of a supportive community can enhance your wellness journey',
      priority: 3,
      contentId: 'support-group'
    });
    
    return recommendations;
  }

  private async saveRecommendationToDatabase(userId: number, recommendation: any) {
    try {
      const savedRec = await db.insert(recommendationsTable).values({
        userId,
        type: recommendation.type,
        title: recommendation.title,
        description: recommendation.description,
        contentId: recommendation.contentId,
        contentType: recommendation.contentType,
        reason: recommendation.reason,
        priority: recommendation.priority,
        shown: false,
        clicked: false,
        dismissed: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire in 24 hours
      }).returning();
      
      return savedRec[0];
    } catch (error) {
      console.error("Error saving recommendation to database:", error);
      // Return the original recommendation if saving fails
      return {
        ...recommendation,
        id: Math.random().toString(36).substr(2, 9), // Fallback ID
        userId,
      };
    }
  }

  private daysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async checkConsecutiveMoodLogs(userId: number): Promise<boolean> {
    try {
      // Get the last 7 days of mood entries
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      
      const recentMoodEntries = await db
        .select()
        .from(moodEntries)
        .where(
          and(
            eq(moodEntries.userId, userId),
            gte(moodEntries.createdAt, last7Days)
          )
        )
        .orderBy(desc(moodEntries.createdAt));
      
      console.log(`User ${userId} has ${recentMoodEntries.length} mood entries in last 7 days`);
      
      if (recentMoodEntries.length < 2) {
        console.log(`User ${userId} has less than 2 mood entries, returning false`);
        return false; // Need at least 2 entries
      }
      
      // Group entries by date
      const entriesByDate = new Map<string, boolean>();
      recentMoodEntries.forEach(entry => {
        const entryDate = new Date(entry.createdAt || new Date());
        const dateKey = entryDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        entriesByDate.set(dateKey, true);
      });
      
      console.log(`User ${userId} mood entries by date:`, Array.from(entriesByDate.keys()));
      
      // Check for any 2 consecutive days
      const today = new Date();
      for (let i = 0; i < 6; i++) { // Check last 6 days for consecutive pairs
        const day1 = new Date(today);
        day1.setDate(day1.getDate() - i);
        const day1Key = day1.toISOString().split('T')[0];
        
        const day2 = new Date(today);
        day2.setDate(day2.getDate() - i - 1);
        const day2Key = day2.toISOString().split('T')[0];
        
        console.log(`Checking consecutive days: ${day1Key} and ${day2Key}`);
        
        if (entriesByDate.has(day1Key) && entriesByDate.has(day2Key)) {
          console.log(`User ${userId} has consecutive mood logs on ${day1Key} and ${day2Key}`);
          return true; // Found 2 consecutive days
        }
      }
      
      console.log(`User ${userId} has no consecutive mood logs`);
      return false; // No consecutive days found
    } catch (error) {
      console.error("Error checking consecutive mood logs:", error);
      return false;
    }
  }

  async updateUserPreferences(userId: number, preferences: any): Promise<void> {
    // Map preferences to DB columns
    const dbPrefs = {
      userId,
      preferredInterventionTypes: preferences.preferredInterventionTypes,
      preferredContentTypes: preferences.preferredContentTypes,
      preferredDuration: preferences.preferredDuration,
      preferredTimeOfDay: preferences.preferredTimeOfDay,
      notificationPreferences: preferences.notificationPreferences,
      updatedAt: new Date(),
    };

    // Try update first
    const updated = await db
      .update(userPreferences)
      .set(dbPrefs)
      .where(eq(userPreferences.userId, userId));

    if (updated.rowCount === 0) {
      // If no row was updated, insert new
      await db.insert(userPreferences).values({
        ...dbPrefs,
        createdAt: new Date(),
      });
    }
  }

  async trackRecommendationInteraction(recommendationId: number | string, action: 'clicked' | 'dismissed'): Promise<void> {
    try {
      // If it's a number, it's a database ID
      if (typeof recommendationId === 'number') {
        await db
          .update(recommendationsTable)
          .set({
            [action]: true,
            shown: true
          })
          .where(eq(recommendationsTable.id, recommendationId));
      } else {
        // If it's a string, it's a fallback ID - just log the interaction
        console.log(`Tracking interaction for fallback recommendation ${recommendationId}: ${action}`);
      }
    } catch (error) {
      console.error("Error tracking recommendation interaction:", error);
    }
  }
}

export const recommendationEngine = new PersonalizedRecommendationEngine(); 