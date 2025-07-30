import { db } from "./db";
import { contentMetadata } from "../shared/schema";

const sampleContent = [
  {
    contentId: "morning-breathing-5min",
    contentType: "breathing",
    title: "Morning Calm Breathing",
    description: "Start your day with a gentle 5-minute breathing exercise to center yourself",
    tags: ["morning", "stress-relief", "beginner"],
    targetMoods: ["anxious", "stressed"],
    duration: 5,
    difficulty: "beginner",
    popularity: 85,
    rating: 4.8,
  },
  {
    contentId: "gratitude-meditation-3min",
    contentType: "meditation",
    title: "Gratitude Practice",
    description: "A short meditation to cultivate gratitude and positive energy",
    tags: ["gratitude", "positive-thinking", "beginner"],
    targetMoods: ["joy", "calm"],
    duration: 3,
    difficulty: "beginner",
    popularity: 92,
    rating: 4.9,
  },
  {
    contentId: "quick-reset-breathing-2min",
    contentType: "breathing",
    title: "Quick Reset",
    description: "A 2-minute breathing break to help you refocus during busy moments",
    tags: ["quick", "focus", "stress-relief"],
    targetMoods: ["stressed", "anxious"],
    duration: 2,
    difficulty: "beginner",
    popularity: 78,
    rating: 4.7,
  },
  {
    contentId: "evening-wind-down-5min",
    contentType: "meditation",
    title: "Evening Wind-Down",
    description: "Gentle meditation to help you relax and prepare for sleep",
    tags: ["evening", "sleep", "relaxation"],
    targetMoods: ["anxious", "stressed"],
    duration: 5,
    difficulty: "beginner",
    popularity: 88,
    rating: 4.8,
  },
  {
    contentId: "understanding-anxiety-guide",
    contentType: "article",
    title: "Understanding Anxiety: A Beginner's Guide",
    description: "Learn about anxiety symptoms, causes, and evidence-based coping strategies",
    tags: ["anxiety", "education", "coping"],
    targetMoods: ["anxious", "stressed"],
    duration: 8,
    difficulty: "beginner",
    popularity: 95,
    rating: 4.9,
  },
  {
    contentId: "stress-management-techniques",
    contentType: "article",
    title: "The Science of Stress and How to Manage It",
    description: "Evidence-based techniques for stress reduction and management",
    tags: ["stress", "science", "techniques"],
    targetMoods: ["stressed", "anxious"],
    duration: 10,
    difficulty: "intermediate",
    popularity: 87,
    rating: 4.8,
  },
  {
    contentId: "building-resilience-daily",
    contentType: "article",
    title: "Building Resilience in Daily Life",
    description: "Practical strategies to strengthen mental resilience and emotional well-being",
    tags: ["resilience", "daily-life", "wellness"],
    targetMoods: ["neutral", "calm"],
    duration: 12,
    difficulty: "intermediate",
    popularity: 82,
    rating: 4.7,
  },
  {
    contentId: "anxiety-support-community",
    contentType: "community_support",
    title: "Anxiety Support Community",
    description: "Connect with others who understand anxiety and share coping strategies",
    tags: ["anxiety", "community", "support"],
    targetMoods: ["anxious", "stressed"],
    duration: 15,
    difficulty: "beginner",
    popularity: 90,
    rating: 4.8,
  },
  {
    contentId: "mindfulness-basics",
    contentType: "meditation",
    title: "Mindfulness Basics",
    description: "Learn the fundamentals of mindfulness meditation",
    tags: ["mindfulness", "basics", "beginner"],
    targetMoods: ["neutral", "calm", "stressed"],
    duration: 10,
    difficulty: "beginner",
    popularity: 89,
    rating: 4.8,
  },
  {
    contentId: "progressive-muscle-relaxation",
    contentType: "meditation",
    title: "Progressive Muscle Relaxation",
    description: "A guided relaxation technique to release physical tension",
    tags: ["relaxation", "tension", "body-scan"],
    targetMoods: ["stressed", "anxious"],
    duration: 8,
    difficulty: "intermediate",
    popularity: 76,
    rating: 4.6,
  },
];

export async function seedContentMetadata() {
  try {
    console.log("Seeding content metadata...");
    
    for (const content of sampleContent) {
      await db
        .insert(contentMetadata)
        .values({
          ...content,
          rating: content.rating.toString(), // Convert number to string for database
        })
        .onConflictDoNothing();
    }
    
    console.log("Content metadata seeded successfully!");
  } catch (error) {
    console.error("Error seeding content metadata:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedContentMetadata()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
} 