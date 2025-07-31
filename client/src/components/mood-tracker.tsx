import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, Heart, Zap, Plus, X } from "lucide-react";

interface MoodTrackerProps {
  onMoodSelect: (mood: string, intensity: number, secondaryMood?: string) => void;
  selectedMood: string | null;
  isLoading?: boolean;
}

interface MoodOption {
  id: string;
  label: string;
  icon: JSX.Element;
  color: string;
  secondaries?: string[];
}

const primaryMoods: MoodOption[] = [
  { 
    id: "joy", 
    label: "Joy", 
    icon: <Heart className="w-6 h-6" />,
    color: "mood-gradient-joy",
    secondaries: ["grateful", "energetic", "hopeful", "excited"]
  },
  { 
    id: "calm", 
    label: "Calm", 
    icon: <Smile className="w-6 h-6" />,
    color: "mood-gradient-calm",
    secondaries: ["peaceful", "content", "relaxed", "centered"]
  },
  { 
    id: "neutral", 
    label: "Neutral", 
    icon: <Meh className="w-6 h-6" />,
    color: "mood-gradient-neutral",
    secondaries: ["tired", "distracted", "indifferent", "balanced"]
  },
  { 
    id: "stressed", 
    label: "Stressed", 
    icon: <Zap className="w-6 h-6" />,
    color: "mood-gradient-stressed",
    secondaries: ["overwhelmed", "frustrated", "pressured", "tense"]
  },
  { 
    id: "anxious", 
    label: "Anxious", 
    icon: <Frown className="w-6 h-6" />,
    color: "mood-gradient-anxious",
    secondaries: ["worried", "panicked", "uneasy", "fearful"]
  }
];

const secondaryMoodLabels: Record<string, string> = {
  // Joy secondaries
  grateful: "Grateful",
  energetic: "Energetic", 
  hopeful: "Hopeful",
  excited: "Excited",
  
  // Calm secondaries
  peaceful: "Peaceful",
  content: "Content",
  relaxed: "Relaxed",
  centered: "Centered",
  
  // Neutral secondaries
  tired: "Tired",
  distracted: "Distracted",
  indifferent: "Indifferent",
  balanced: "Balanced",
  
  // Stressed secondaries
  overwhelmed: "Overwhelmed",
  frustrated: "Frustrated",
  pressured: "Pressured",
  tense: "Tense",
  
  // Anxious secondaries
  worried: "Worried",
  panicked: "Panicked",
  uneasy: "Uneasy",
  fearful: "Fearful"
};

export function MoodTracker({ onMoodSelect, selectedMood, isLoading = false }: MoodTrackerProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [selectedPrimaryMood, setSelectedPrimaryMood] = useState<MoodOption | null>(null);
  const [selectedSecondaryMood, setSelectedSecondaryMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number[]>([3]);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const [showSecondarySelection, setShowSecondarySelection] = useState(false);
  const intensityRef = useRef<HTMLDivElement>(null);

  const handlePrimaryMoodClick = (mood: MoodOption) => {
    setSelectedPrimaryMood(mood);
    setSelectedSecondaryMood(null);
    setShowSecondarySelection(true);
    setShowIntensitySlider(false);
    setIntensity([3]);
  };

  const handleSecondaryMoodClick = (secondaryMood: string) => {
    setSelectedSecondaryMood(secondaryMood);
    setShowSecondarySelection(false);
    setShowIntensitySlider(true);
    
    // Generate recommendation based on primary + secondary combination
    const recommendations = {
      "joy-grateful": "Your gratitude is showing! Consider writing in your gratitude journal.",
      "joy-energetic": "Great energy! Channel this into a productive activity or exercise.",
      "joy-hopeful": "Hope is powerful. Share your positive outlook with the community.",
      "joy-excited": "Excitement is contagious! Consider sharing your enthusiasm with others.",
      
      "calm-peaceful": "Beautiful state of peace. Try a longer meditation to deepen this feeling.",
      "calm-content": "Contentment is a gift. Savor this moment with mindful awareness.",
      "calm-relaxed": "Perfect time for a body scan meditation to enhance your relaxation.",
      "calm-centered": "You're in a great space. Try some gentle stretching or yoga.",
      
      "neutral-tired": "Rest is important. Consider a short nap or relaxation exercise.",
      "neutral-distracted": "Mindfulness can help focus. Try a 3-minute breathing exercise.",
      "neutral-indifferent": "It's okay to feel neutral. Try a quick mood-boosting activity.",
      "neutral-balanced": "Balance is healthy. Maintain this equilibrium with gentle self-care.",
      
      "stressed-overwhelmed": "Take a step back. Our crisis resources can help you find calm.",
      "stressed-frustrated": "Frustration is valid. Try our thought check-in to process this.",
      "stressed-pressured": "Pressure can be managed. Try progressive muscle relaxation.",
      "stressed-tense": "Tension needs release. Try our guided breathing exercise.",
      
      "anxious-worried": "Worries can be managed. Try our thought challenging exercises.",
      "anxious-panicked": "You're safe. Use our grounding tools to find your center.",
      "anxious-uneasy": "Unease is temporary. Try our quick meditation for relief.",
      "anxious-fearful": "Fear is a natural response. Our community can offer support."
    };
    
    const key = `${selectedPrimaryMood?.id}-${secondaryMood}`;
    setRecommendation(recommendations[key as keyof typeof recommendations] || 
      "Your feelings are valid. Consider trying one of our wellness tools.");
  };

  const handleIntensitySubmit = () => {
    if (selectedPrimaryMood) {
      onMoodSelect(selectedPrimaryMood.id, intensity[0], selectedSecondaryMood || undefined);
      setShowIntensitySlider(false);
      setSelectedPrimaryMood(null);
      setSelectedSecondaryMood(null);
      setRecommendation(null);
    }
  };

  const resetToPrimarySelection = () => {
    setShowSecondarySelection(false);
    setShowIntensitySlider(false);
    setSelectedPrimaryMood(null);
    setSelectedSecondaryMood(null);
    setIntensity([3]);
    setRecommendation(null);
  };

  const skipSecondarySelection = () => {
    setShowSecondarySelection(false);
    setShowIntensitySlider(true);
    setSelectedSecondaryMood(null);
    
    // Generate recommendation for primary mood only
    const primaryRecommendations = {
      joy: "Great to feel joyful! Consider sharing this positive energy.",
      calm: "Calm is a beautiful state. Try a meditation to maintain it.",
      neutral: "Neutral is perfectly normal. Try our breathing exercise.",
      stressed: "Stress is manageable. Try our 3-minute breathing exercise.",
      anxious: "Anxiety can be eased. Try our guided breathing or reach out to the community."
    };
    
    setRecommendation(primaryRecommendations[selectedPrimaryMood?.id as keyof typeof primaryRecommendations]);
  };

  // Handle clicks outside the selection areas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSecondarySelection && intensityRef.current && !intensityRef.current.contains(event.target as Node)) {
        resetToPrimarySelection();
      }
      if (showIntensitySlider && intensityRef.current && !intensityRef.current.contains(event.target as Node)) {
        resetToPrimarySelection();
      }
    };

    if (showSecondarySelection || showIntensitySlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSecondarySelection, showIntensitySlider]);

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Mood</h3>
        
        {/* Primary Mood Selection */}
        {!showSecondarySelection && !showIntensitySlider && (
          <div className="grid grid-cols-5 gap-3 mb-4">
            {primaryMoods.map((mood) => (
              <Button
                key={mood.id}
                variant="outline"
                className={cn(
                  "flex flex-col items-center p-3 h-auto border-2 hover:border-[hsl(207,90%,54%)] transition-colors",
                  mood.color,
                  selectedPrimaryMood?.id === mood.id && "border-[hsl(207,90%,54%)] ring-2 ring-[hsl(207,90%,54%)] ring-opacity-50"
                )}
                onClick={() => handlePrimaryMoodClick(mood)}
                disabled={isLoading}
              >
                <div className="text-gray-700 mb-2">
                  {mood.icon}
                </div>
                <span className="text-xs text-gray-600">{mood.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Secondary Mood Selection */}
        {showSecondarySelection && selectedPrimaryMood && (
          <div ref={intensityRef} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">
                How specifically are you feeling?
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipSecondarySelection}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Skip
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {selectedPrimaryMood.secondaries?.map((secondary) => (
                <Button
                  key={secondary}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs h-auto py-2 border border-gray-200 hover:border-blue-300",
                    selectedSecondaryMood === secondary && "border-blue-500 bg-blue-50 text-blue-700"
                  )}
                  onClick={() => handleSecondaryMoodClick(secondary)}
                >
                  {secondaryMoodLabels[secondary]}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToPrimarySelection}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3 mr-1" />
                Back
              </Button>
              <span className="text-xs text-gray-500">
                Optional - helps us provide better recommendations
              </span>
            </div>
          </div>
        )}

        {/* Intensity Slider */}
        {showIntensitySlider && selectedPrimaryMood && (
          <div ref={intensityRef} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              How intense is your {selectedPrimaryMood.label.toLowerCase()}
              {selectedSecondaryMood && ` and ${secondaryMoodLabels[selectedSecondaryMood].toLowerCase()}`} feeling?
            </h4>
            <div className="space-y-4">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Mild</span>
                <span className="font-medium text-blue-600">Level {intensity[0]}</span>
                <span>Very Intense</span>
              </div>
              <Button
                onClick={handleIntensitySubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 rounded-xl py-2 font-medium"
              >
                {isLoading ? "Logging..." : "Log My Mood"}
              </Button>
            </div>
          </div>
        )}

        {recommendation && (
          <div className="p-4 bg-[hsl(207,90%,94%)] rounded-xl">
            <p className="text-sm text-[hsl(207,90%,54%)] font-medium mb-1">
              Based on your mood, here's what we recommend:
            </p>
            <p className="text-xs text-gray-600">{recommendation}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-[hsl(207,90%,54%)] border-t-transparent rounded-full animate-spin"></div>
              Logging your mood...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
