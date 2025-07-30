import { db } from "./db";
import { sql } from "drizzle-orm";

export async function createRecommendationTables() {
  try {
    console.log("Creating recommendation tables...");

    // Create user_preferences table
    console.log("Creating user_preferences table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id serial PRIMARY KEY,
        user_id integer NOT NULL,
        preferred_intervention_types jsonb,
        preferred_content_types jsonb,
        preferred_duration integer,
        preferred_time_of_day text,
        notification_preferences jsonb,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    console.log("✓ user_preferences table created");

    // Create recommendations table
    console.log("Creating recommendations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS recommendations (
        id serial PRIMARY KEY,
        user_id integer NOT NULL,
        type text NOT NULL,
        title text NOT NULL,
        description text,
        content_id text,
        content_type text,
        reason text,
        priority integer DEFAULT 1,
        shown boolean DEFAULT false,
        clicked boolean DEFAULT false,
        dismissed boolean DEFAULT false,
        created_at timestamp DEFAULT now(),
        expires_at timestamp
      )
    `);
    console.log("✓ recommendations table created");

    // Create content_metadata table
    console.log("Creating content_metadata table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_metadata (
        id serial PRIMARY KEY,
        content_id text NOT NULL,
        content_type text NOT NULL,
        title text NOT NULL,
        description text,
        tags jsonb,
        target_moods jsonb,
        duration integer,
        difficulty text,
        popularity integer DEFAULT 0,
        rating numeric(3, 2) DEFAULT '0',
        created_at timestamp DEFAULT now()
      )
    `);
    console.log("✓ content_metadata table created");

    // Add foreign key constraints
    console.log("Adding foreign key constraints...");
    try {
      await db.execute(sql`
        ALTER TABLE user_preferences 
        ADD CONSTRAINT user_preferences_user_id_users_id_fk 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action
      `);
      console.log("✓ user_preferences foreign key added");
    } catch (error) {
      console.log("⚠ user_preferences foreign key already exists or failed");
    }

    try {
      await db.execute(sql`
        ALTER TABLE recommendations 
        ADD CONSTRAINT recommendations_user_id_users_id_fk 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action
      `);
      console.log("✓ recommendations foreign key added");
    } catch (error) {
      console.log("⚠ recommendations foreign key already exists or failed");
    }

    console.log("Recommendation tables created successfully!");
  } catch (error) {
    console.error("Error creating recommendation tables:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createRecommendationTables()
    .then(() => {
      console.log("Setup complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
} 