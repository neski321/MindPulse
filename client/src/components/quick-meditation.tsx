import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, CheckCircle, Heart, Moon, Sun } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface QuickMeditationProps {
  onComplete?: () => void;
}

export default function QuickMeditation({ onComplete }: QuickMeditationProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const interventionMutation = useMutation({
    mutationFn: async (meditation: any) => {
      if (!user) return;
      return apiRequest("POST", "/api/interventions", {
        userId: user.id,
        type: "meditation",
        title: meditation.name,
        content: `Completed a ${meditation.name} meditation`,
        duration: Math.round(meditation.duration / 60),
        completed: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Meditation Saved!",
        description: "Your progress has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving intervention",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const meditationTypes = [
    {
      id: "breathing",
      name: "Breathing Focus",
      description: "4-7-8 breathing technique for relaxation",
      duration: 180, // 3 minutes
      icon: <Heart className="w-5 h-5" />,
      color: "bg-blue-500",
      lightColor: "bg-blue-100",
      phases: [
        { name: "Inhale", duration: 4, instruction: "Breathe in slowly through your nose" },
        { name: "Hold", duration: 7, instruction: "Hold your breath gently" },
        { name: "Exhale", duration: 8, instruction: "Exhale slowly through your mouth" }
      ]
    },
    {
      id: "body-scan",
      name: "Body Scan",
      description: "Quick body awareness meditation",
      duration: 300, // 5 minutes
      icon: <Sun className="w-5 h-5" />,
      color: "bg-orange-500",
      lightColor: "bg-orange-100",
      phases: [
        { name: "Settle", duration: 30, instruction: "Find a comfortable position and close your eyes" },
        { name: "Head", duration: 45, instruction: "Notice sensations in your head and face" },
        { name: "Shoulders", duration: 45, instruction: "Relax your shoulders and neck" },
        { name: "Arms", duration: 45, instruction: "Feel your arms and hands" },
        { name: "Chest", duration: 45, instruction: "Notice your breathing and chest" },
        { name: "Belly", duration: 45, instruction: "Observe your belly rising and falling" },
        { name: "Legs", duration: 45, instruction: "Feel your legs and feet" },
        { name: "Whole Body", duration: 20, instruction: "Sense your whole body as one" }
      ]
    },
    {
      id: "loving-kindness",
      name: "Loving Kindness",
      description: "Cultivate compassion and self-love",
      duration: 240, // 4 minutes
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-500",
      lightColor: "bg-pink-100",
      phases: [
        { name: "Self", duration: 60, instruction: "May I be happy, may I be healthy, may I be at peace" },
        { name: "Loved One", duration: 60, instruction: "Think of someone you love and send them kind wishes" },
        { name: "Neutral Person", duration: 60, instruction: "Think of someone neutral and wish them well" },
        { name: "Everyone", duration: 60, instruction: "May all beings be happy and free from suffering" }
      ]
    }
  ];

  const selectedMeditation = meditationTypes.find(m => m.id === selectedType);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase or complete
            if (selectedMeditation && currentPhase < selectedMeditation.phases.length - 1) {
              setCurrentPhase(prev => prev + 1);
              return selectedMeditation.phases[currentPhase + 1].duration;
            } else {
              setIsActive(false);
              setIsComplete(true);
              // Save intervention completion
              if (user && selectedMeditation) interventionMutation.mutate(selectedMeditation);
              onComplete?.();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentPhase, selectedMeditation, onComplete, user]);

  const startMeditation = (type: string) => {
    const meditation = meditationTypes.find(m => m.id === type);
    if (meditation) {
      setSelectedType(type);
      setCurrentPhase(0);
      setTimeRemaining(meditation.phases[0].duration);
      setIsActive(true);
      setIsComplete(false);
    }
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setTimeRemaining(selectedMeditation?.phases[0].duration || 0);
    setIsComplete(false);
  };

  const backToSelection = () => {
    setSelectedType(null);
    setIsActive(false);
    setCurrentPhase(0);
    setTimeRemaining(0);
    setIsComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingScale = () => {
    if (!selectedMeditation || selectedMeditation.id !== "breathing") return 1;
    
    const phase = selectedMeditation.phases[currentPhase];
    const progress = (phase.duration - timeRemaining) / phase.duration;
    
    if (phase.name === "Inhale") {
      return 1 + (progress * 0.5); // Scale from 1 to 1.5
    } else if (phase.name === "Exhale") {
      return 1.5 - (progress * 0.5); // Scale from 1.5 to 1
    }
    return 1.25; // Hold phase
  };

  // Selection Screen
  if (!selectedType) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Meditation</h1>
          <p className="text-gray-600">Choose a meditation to begin</p>
        </div>

        <div className="space-y-4">
          {meditationTypes.map((meditation) => (
            <Card 
              key={meditation.id}
              className="card-shadow hover:card-shadow-hover transition-all cursor-pointer transform hover:scale-105"
              onClick={() => startMeditation(meditation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${meditation.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white">{meditation.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{meditation.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{meditation.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(meditation.duration / 60)} min
                    </Badge>
                  </div>
                  <Play className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Meditation Screen
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">{selectedMeditation?.name}</h1>
        <p className="text-sm text-gray-600">
          {selectedMeditation?.phases[currentPhase].name} • {formatTime(timeRemaining)}
        </p>
      </div>

      {/* Main Animation */}
      <Card className="card-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Breathing Circle Animation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full ${selectedMeditation?.lightColor} transition-all duration-1000 ease-in-out`}
                style={{
                  transform: `scale(${getBreathingScale()})`,
                  opacity: isActive ? 0.6 : 0.3
                }}
              />
              <div 
                className={`absolute inset-4 rounded-full ${selectedMeditation?.color} transition-all duration-1000 ease-in-out`}
                style={{
                  transform: `scale(${getBreathingScale()})`,
                  opacity: isActive ? 0.8 : 0.5
                }}
              />
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center z-10">
                <span className="text-white">{selectedMeditation?.icon}</span>
              </div>
            </div>

            {/* Instruction Text */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {selectedMeditation?.phases[currentPhase].instruction}
              </p>
              <div className="flex justify-center gap-2">
                {selectedMeditation?.phases.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentPhase 
                        ? selectedMeditation.color.replace('bg-', 'bg-') 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetMeditation}
                disabled={timeRemaining === selectedMeditation?.phases[0].duration}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={togglePause}
                disabled={isComplete}
                className={`px-6 ${selectedMeditation?.color} text-white hover:opacity-90`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={backToSelection}
              >
                Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      {isComplete && (
        <Card className="card-shadow border-green-200 bg-green-50 animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Well done!</h3>
            <p className="text-sm text-gray-600">
              You've completed your {selectedMeditation?.name.toLowerCase()} meditation. 
              Take a moment to notice how you feel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}