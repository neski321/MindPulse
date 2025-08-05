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
  userName: string,
  secondaryMood?: string
): Promise<PersonalizedIntervention> {
  try {
    const moodDescription = secondaryMood 
      ? `${mood} and ${secondaryMood}` 
      : mood;
    
    const prompt = `You are a compassionate mental health AI assistant. Create a personalized micro-intervention for ${userName} who is currently feeling ${moodDescription} at intensity ${intensity}/5. 

Recent mood patterns: ${recentMoods.join(', ')}

Create a 2-5 minute intervention that is:
- Evidence-based (CBT, mindfulness, or breathing techniques)
- Appropriate for the current mood combination and intensity
- Practical and immediately actionable
- Supportive and non-judgmental

${secondaryMood ? `Note: The user is feeling both ${mood} and ${secondaryMood}. Consider how these emotions interact and create an intervention that addresses both aspects.` : ''}

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
  userName: string,
  secondaryMood?: string
): Promise<CBTPrompt> {
  try {
    const moodDescription = secondaryMood 
      ? `${mood} and ${secondaryMood}` 
      : mood;
    
    const prompt = `Create a gentle CBT-inspired thought examination prompt for ${userName} who is feeling ${moodDescription} at intensity ${intensity}/5.

The prompt should:
- Help identify negative thought patterns
- Provide gentle questioning to examine thoughts
- Offer reframing techniques
- Be supportive and non-judgmental

${secondaryMood ? `Consider how the combination of ${mood} and ${secondaryMood} might affect thought patterns and create a prompt that addresses both emotional aspects.` : ''}

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
  moodHistory: Array<{ mood: string; intensity: number; date: Date; secondaryMood?: string }>
): Promise<MoodInsight> {
  try {
    const moodData = moodHistory.map(entry => ({
      mood: entry.mood,
      secondaryMood: entry.secondaryMood,
      intensity: entry.intensity,
      dayOfWeek: entry.date.getDay(),
      timeOfDay: entry.date.getHours()
    }));

    const prompt = `Analyze this mood pattern data and provide insights:
${JSON.stringify(moodData)}

Look for:
- Patterns in mood changes and combinations
- Time-based trends
- Intensity variations
- Secondary emotion patterns
- Actionable recommendations based on emotional complexity

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

export async function generateCrisisIntervention(
  mood: string,
  intensity: number,
  secondaryMood?: string
): Promise<PersonalizedIntervention> {
  try {
    const moodDescription = secondaryMood 
      ? `${mood} and ${secondaryMood}` 
      : mood;
    
    const prompt = `Create an immediate crisis intervention for someone feeling ${moodDescription} at intensity ${intensity}/5.

This should be:
- Immediately actionable (1-3 minutes)
- Grounding and calming
- Safe and evidence-based
- Designed for acute distress

${secondaryMood === 'overwhelmed' || secondaryMood === 'panicked' ? 'This person is in acute distress and needs immediate grounding techniques.' : ''}

Respond with JSON in this format:
{
  "type": "grounding|breathing|cbt",
  "title": "Brief descriptive title",
  "content": "Full intervention content with gentle guidance",
  "duration": number_in_minutes,
  "instructions": ["step 1", "step 2", "step 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.5,
        responseMimeType: "application/json",
        systemInstruction: "You are a crisis intervention AI that provides immediate, safe, and effective interventions for acute mental health distress."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    return {
      type: parsedResult.type || "grounding",
      title: parsedResult.title || "Immediate Grounding",
      content: parsedResult.content || "Let's help you find your center right now.",
      duration: parsedResult.duration || 2,
      instructions: parsedResult.instructions || ["Find a comfortable position", "Take slow breaths", "Focus on the present moment"]
    };
  } catch (error) {
    console.error("Error generating crisis intervention:", error);
    // Return a safe default crisis intervention
    return {
      type: "grounding",
      title: "5-4-3-2-1 Grounding",
      content: "Let's use the 5-4-3-2-1 grounding technique to help you feel more present and safe.",
      duration: 2,
      instructions: [
        "Name 5 things you can see",
        "Name 4 things you can touch",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
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

export async function selectWellnessToolsForIntervention(
  mood: string,
  intensity: number,
  secondaryMood?: string
): Promise<{ tool1: string; tool2: string; reasoning: string }> {
  try {
    const moodDescription = secondaryMood 
      ? `${mood} and ${secondaryMood}` 
      : mood;
    
    const availableTools = [
      { id: "breathing-exercise", name: "Breathing Exercise", description: "Immediate calming through controlled breathing" },
      { id: "sensory-grounding", name: "Sensory Grounding", description: "5-4-3-2-1 grounding technique for acute distress" },
      { id: "quick-meditation", name: "Quick Meditation", description: "2-minute guided meditation for stress relief" },
      { id: "cbt-thought-record", name: "CBT Thought Record", description: "Structured thought examination and reframing" },
      { id: "crisis-safety-planning", name: "Crisis Safety Planning", description: "Create personalized safety plans" },
      { id: "gratitude-journal", name: "Gratitude Journal", description: "Shift focus to positive aspects" },
      { id: "body-scan-meditation", name: "Body Scan Meditation", description: "Progressive relaxation for physical tension" },
      { id: "self-care-menu", name: "Self-Care Menu", description: "AI-powered personalized suggestions" }
    ];

    const prompt = `A user is experiencing ${moodDescription} at intensity ${intensity}/5. 

Available wellness tools:
${availableTools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

Select the TWO most appropriate tools for this specific emotional state and intensity level. Consider:
- For high intensity (4-5): Immediate grounding and crisis tools
- For moderate intensity (3): Breathing and meditation tools  
- For anxiety/stress: Breathing and grounding tools
- For depression/low mood: Gratitude and CBT tools
- For overwhelming feelings: Crisis planning and grounding tools

Respond with JSON in this format:
{
  "tool1": "tool_id",
  "tool2": "tool_id", 
  "reasoning": "Brief explanation of why these tools are most appropriate"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        systemInstruction: "You are a mental health AI that selects the most appropriate wellness tools based on emotional state and intensity. Prioritize safety and immediate effectiveness."
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const parsedResult = JSON.parse(text);
    
    // Validate that the selected tools exist
    const validTools = availableTools.map(tool => tool.id);
    const tool1 = validTools.includes(parsedResult.tool1) ? parsedResult.tool1 : "breathing-exercise";
    const tool2 = validTools.includes(parsedResult.tool2) ? parsedResult.tool2 : "sensory-grounding";
    
    return {
      tool1,
      tool2,
      reasoning: parsedResult.reasoning || "These tools are designed to help with your current emotional state"
    };
  } catch (error) {
    console.error("Error selecting wellness tools:", error);
    // Return safe defaults
    return {
      tool1: "breathing-exercise",
      tool2: "sensory-grounding",
      reasoning: "Breathing exercises and grounding techniques can help with difficult emotions"
    };
  }
}