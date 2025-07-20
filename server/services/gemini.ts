import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PersonalizedIntervention {
  type: string;
  title: string;
  content: string;
  duration: number;
  instructions: string[];
}

export interface CBTPrompt {
  question: string;
  followUp: string;
  reframingTechnique: string;
}

export interface MoodInsight {
  pattern: string;
  recommendation: string;
  confidence: number;
}

export async function generatePersonalizedIntervention(
  mood: string,
  intensity: number,
  recentMoods: string[],
  userName: string
): Promise<PersonalizedIntervention> {
  try {
    const prompt = `You are a compassionate mental health AI assistant. Create a personalized micro-intervention for ${userName} who is currently feeling ${mood} at intensity ${intensity}/5. 

Recent mood patterns: ${recentMoods.join(', ')}

Create a 2-5 minute intervention that is:
- Evidence-based (CBT, mindfulness, or breathing techniques)
- Appropriate for the current mood and intensity
- Practical and immediately actionable
- Supportive and non-judgmental

Respond with JSON in this format:
{
  "type": "breathing|cbt|meditation|grounding",
  "title": "Brief descriptive title",
  "content": "Full intervention content with gentle guidance",
  "duration": number_in_minutes,
  "instructions": ["step 1", "step 2", "step 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        systemInstruction: "You are a specialized mental health AI that creates personalized, evidence-based micro-interventions. Always prioritize safety and provide gentle, supportive guidance."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    return {
      type: parsedResult.type || "breathing",
      title: parsedResult.title || "Take a Moment",
      content: parsedResult.content || "Take a few deep breaths and be gentle with yourself.",
      duration: parsedResult.duration || 3,
      instructions: parsedResult.instructions || ["Breathe slowly", "Focus on the present", "Be kind to yourself"]
    };
  } catch (error) {
    console.error("Error generating personalized intervention:", error);
    // Return a safe default intervention
    return {
      type: "breathing",
      title: "Gentle Breathing",
      content: "Let's take a moment to breathe together. Find a comfortable position and follow along with this simple breathing exercise.",
      duration: 3,
      instructions: [
        "Breathe in slowly for 4 counts",
        "Hold your breath for 4 counts", 
        "Exhale slowly for 6 counts",
        "Repeat this cycle 5 times"
      ]
    };
  }
}

export async function generateCBTPrompt(
  mood: string,
  intensity: number,
  userName: string
): Promise<CBTPrompt> {
  try {
    const prompt = `Create a gentle CBT-inspired thought examination prompt for ${userName} who is feeling ${mood} at intensity ${intensity}/5.

The prompt should:
- Help identify negative thought patterns
- Provide gentle questioning to examine thoughts
- Offer reframing techniques
- Be supportive and non-judgmental

Respond with JSON in this format:
{
  "question": "Gentle question to identify the thought",
  "followUp": "Follow-up question to examine the thought",
  "reframingTechnique": "Specific technique to reframe the thought"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        systemInstruction: "You are a CBT-trained mental health AI that creates gentle, evidence-based thought examination exercises."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    return {
      question: parsedResult.question || "What's one thought that's been on your mind today?",
      followUp: parsedResult.followUp || "What evidence do you have for and against this thought?",
      reframingTechnique: parsedResult.reframingTechnique || "Try viewing this situation from a friend's perspective - what would you tell them?"
    };
  } catch (error) {
    console.error("Error generating CBT prompt:", error);
    return {
      question: "What's one thought that's been weighing on you today?",
      followUp: "Is this thought helpful or unhelpful right now?",
      reframingTechnique: "What would you tell a good friend who had this same thought?"
    };
  }
}

export async function analyzeMoodPattern(
  moodHistory: Array<{ mood: string; intensity: number; date: Date }>
): Promise<MoodInsight> {
  try {
    const moodData = moodHistory.map(entry => ({
      mood: entry.mood,
      intensity: entry.intensity,
      dayOfWeek: entry.date.getDay(),
      timeOfDay: entry.date.getHours()
    }));

    const prompt = `Analyze this mood pattern data and provide insights:
${JSON.stringify(moodData)}

Look for:
- Patterns in mood changes
- Time-based trends
- Intensity variations
- Actionable recommendations

Respond with JSON in this format:
{
  "pattern": "Description of key pattern observed",
  "recommendation": "Specific, actionable recommendation",
  "confidence": number_between_0_and_1
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        systemInstruction: "You are a mental health analytics AI that identifies patterns in mood data and provides evidence-based recommendations."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    return {
      pattern: parsedResult.pattern || "Your mood shows natural variation throughout the week",
      recommendation: parsedResult.recommendation || "Continue regular check-ins to better understand your patterns",
      confidence: Math.max(0, Math.min(1, parsedResult.confidence || 0.7))
    };
  } catch (error) {
    console.error("Error analyzing mood pattern:", error);
    return {
      pattern: "Building your mood history to identify patterns",
      recommendation: "Keep tracking your daily moods to gain insights over time",
      confidence: 0.5
    };
  }
}

export async function moderateContent(content: string): Promise<{ safe: boolean; reason?: string }> {
  try {
    const prompt = `Please moderate this content for a mental health support community: "${content}"

Flag content that contains:
- Self-harm or suicide ideation
- Harassment or bullying
- Inappropriate or harmful content

Allow supportive, helpful content.

Respond with JSON in this format:
{
  "safe": true/false,
  "reason": "explanation if not safe"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        systemInstruction: "You are a content moderation AI for a mental health support community. Flag content that contains self-harm, suicide ideation, harassment, or inappropriate content. Allow supportive, helpful content."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    return {
      safe: parsedResult.safe !== false,
      reason: parsedResult.reason
    };
  } catch (error) {
    console.error("Error moderating content:", error);
    // Default to safe if moderation fails
    return { safe: true };
  }
}