import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, Heart, Zap } from "lucide-react";

interface MoodTrackerProps {
  onMoodSelect: (mood: string, intensity: number) => void;
  selectedMood: string | null;
  isLoading?: boolean;
}

const moods = [
  { 
    id: "joy", 
    label: "Joy", 
    icon: <Heart className="w-6 h-6" />,
    color: "mood-gradient-joy"
  },
  { 
    id: "calm", 
    label: "Calm", 
    icon: <Smile className="w-6 h-6" />,
    color: "mood-gradient-calm"
  },
  { 
    id: "neutral", 
    label: "Neutral", 
    icon: <Meh className="w-6 h-6" />,
    color: "mood-gradient-neutral"
  },
  { 
    id: "stressed", 
    label: "Stressed", 
    icon: <Zap className="w-6 h-6" />,
    color: "mood-gradient-stressed"
  },
  { 
    id: "anxious", 
    label: "Anxious", 
    icon: <Frown className="w-6 h-6" />,
    color: "mood-gradient-anxious"
  }
];

export function MoodTracker({ onMoodSelect, selectedMood, isLoading = false }: MoodTrackerProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [selectedMoodData, setSelectedMoodData] = useState<typeof moods[0] | null>(null);
  const [intensity, setIntensity] = useState<number[]>([3]);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const intensityRef = useRef<HTMLDivElement>(null);

  const handleMoodClick = (mood: typeof moods[0]) => {
    setSelectedMoodData(mood);
    setShowIntensitySlider(true);
    setIntensity([3]); // Reset to default intensity
    
    // Set a sample recommendation based on mood
    const recommendations = {
      joy: "Keep up the positive energy! Try sharing your joy with the community.",
      calm: "Great to hear you're feeling calm. Consider a short meditation to maintain this state.",
      neutral: "It's perfectly normal to feel neutral. Try our breathing exercise to center yourself.",
      stressed: "Take a moment to breathe. Our 3-minute breathing exercise can help you reset.",
      anxious: "You're not alone in feeling anxious. Try our guided breathing or reach out to the community."
    };
    
    setRecommendation(recommendations[mood.id as keyof typeof recommendations]);
  };

  const handleIntensitySubmit = () => {
    if (selectedMoodData) {
      onMoodSelect(selectedMoodData.id, intensity[0]);
      setShowIntensitySlider(false);
      setSelectedMoodData(null);
    }
  };

  const resetToMoodSelection = () => {
    setShowIntensitySlider(false);
    setSelectedMoodData(null);
    setIntensity([3]);
  };

  // Handle clicks outside the intensity slider
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showIntensitySlider && intensityRef.current && !intensityRef.current.contains(event.target as Node)) {
        resetToMoodSelection();
      }
    };

    if (showIntensitySlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIntensitySlider]);

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Mood</h3>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="outline"
              className={cn(
                "flex flex-col items-center p-3 h-auto border-2 hover:border-[hsl(207,90%,54%)] transition-colors",
                mood.color,
                selectedMoodData?.id === mood.id && "border-[hsl(207,90%,54%)] ring-2 ring-[hsl(207,90%,54%)] ring-opacity-50"
              )}
              onClick={() => handleMoodClick(mood)}
              disabled={isLoading || showIntensitySlider}
            >
              <div className="text-gray-700 mb-2">
                {mood.icon}
              </div>
              <span className="text-xs text-gray-600">{mood.label}</span>
            </Button>
          ))}
        </div>

        {showIntensitySlider && selectedMoodData && (
          <div ref={intensityRef} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              How intense is your {selectedMoodData.label.toLowerCase()} feeling?
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
