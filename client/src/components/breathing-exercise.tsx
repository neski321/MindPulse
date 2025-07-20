import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingExerciseProps {
  onClose: () => void;
}

type Phase = "inhale" | "hold" | "exhale" | "rest";

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);

  const phases = {
    inhale: { duration: 4, next: "hold", text: "Breathe In" },
    hold: { duration: 4, next: "exhale", text: "Hold" },
    exhale: { duration: 6, next: "rest", text: "Breathe Out" },
    rest: { duration: 2, next: "inhale", text: "Rest" }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phases[phase];
      const nextPhase = currentPhase.next as Phase;
      
      if (phase === "rest") {
        setCycle(prev => prev + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          return;
        }
      }
      
      setPhase(nextPhase);
      setTimeLeft(phases[nextPhase].duration);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle, totalCycles]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(4);
    setCycle(0);
  };

  const getCircleScale = () => {
    const baseScale = 1;
    const maxScale = 1.3;
    
    if (phase === "inhale") {
      return baseScale + (maxScale - baseScale) * (1 - timeLeft / phases[phase].duration);
    } else if (phase === "exhale") {
      return maxScale - (maxScale - baseScale) * (1 - timeLeft / phases[phase].duration);
    } else if (phase === "hold") {
      return maxScale;
    }
    return baseScale;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Breathing Exercise</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div 
                className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(142,71%,45%)] to-[hsl(207,90%,54%)] transition-transform duration-1000 ease-in-out flex items-center justify-center",
                  phase === "inhale" || phase === "exhale" ? "animate-pulse" : ""
                )}
                style={{
                  transform: `scale(${getCircleScale()})`,
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-1">{timeLeft}</div>
                  <div className="text-sm">{phases[phase].text}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {phases[phase].text}
              </p>
              <p className="text-sm text-gray-600">
                Cycle {cycle + 1} of {totalCycles}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            {!isActive ? (
              <Button
                onClick={handleStart}
                className="bg-[hsl(142,71%,45%)] text-white hover:bg-[hsl(142,71%,40%)]"
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                className="bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)]"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Inhale for 4 seconds, hold for 4, exhale for 6, rest for 2</p>
          </div>

          {cycle >= totalCycles && (
            <div className="text-center mt-4 p-4 bg-[hsl(142,71%,95%)] rounded-lg">
              <p className="text-[hsl(142,71%,45%)] font-medium">
                Great job! You've completed the breathing exercise.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Take a moment to notice how you feel.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
