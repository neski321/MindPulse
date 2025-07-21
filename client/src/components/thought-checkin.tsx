import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, ArrowRight, CheckCircle, Lightbulb, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ThoughtCheckinProps {
  onComplete?: () => void;
}

export default function ThoughtCheckin({ onComplete }: ThoughtCheckinProps) {
  const [step, setStep] = useState(0);
  const [thoughts, setThoughts] = useState({
    initial: "",
    evidence: "",
    reframe: ""
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const interventionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      return apiRequest("POST", "/api/interventions", {
        userId: user.id,
        type: "cbt",
        title: "Thought Check-In",
        content: "Completed a CBT thought check-in.",
        duration: 5, // 5 minutes
        completed: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Thought Check-In Saved!",
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

  const steps = [
    {
      title: "What's on your mind?",
      description: "Share what's been weighing on you today",
      icon: <Brain className="w-5 h-5" />,
      color: "bg-blue-500",
      field: "initial"
    },
    {
      title: "Let's examine this thought",
      description: "What evidence supports or challenges this thought?",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "bg-yellow-500",
      field: "evidence"
    },
    {
      title: "Reframe your perspective",
      description: "How might you view this situation differently?",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-green-500",
      field: "reframe"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Save intervention completion
      if (user) interventionMutation.mutate();
      onComplete?.();
    }
  };

  const handleInputChange = (value: string) => {
    setThoughts(prev => ({
      ...prev,
      [steps[step].field]: value
    }));
  };

  const currentStep = steps[step];
  const isComplete = step === steps.length - 1 && thoughts.reframe.trim() !== "";

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                index <= step 
                  ? 'bg-[hsl(207,90%,54%)] text-white scale-110' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {index < step ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`w-12 h-0.5 mx-2 transition-all duration-500 ${
                  index < step ? 'bg-[hsl(207,90%,54%)]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card 
        className={`card-shadow transition-all duration-300 ${
          isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 ${currentStep.color} rounded-full flex items-center justify-center`}>
              <span className="text-white">{currentStep.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
              <p className="text-sm text-gray-600">{currentStep.description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breathing Animation */}
          <div className="flex justify-center mb-6">
            <div 
              className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center
                animate-pulse transition-all duration-1000`}
            >
              <div className="w-8 h-8 bg-[hsl(207,90%,54%)] rounded-full animate-ping opacity-75" />
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <Textarea
              placeholder="Take your time... there's no rush"
              value={thoughts[currentStep.field as keyof typeof thoughts]}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 focus:border-[hsl(207,90%,54%)] focus:ring-[hsl(207,90%,54%)]"
            />
            
            {/* Helpful Prompts */}
            <div className="flex flex-wrap gap-2">
              {step === 0 && (
                <>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    I'm worried about...
                  </Badge>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    I keep thinking...
                  </Badge>
                </>
              )}
              {step === 1 && (
                <>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    Evidence for this thought...
                  </Badge>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    Evidence against this thought...
                  </Badge>
                </>
              )}
              {step === 2 && (
                <>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    A friend might say...
                  </Badge>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                    A more balanced view...
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={thoughts[currentStep.field as keyof typeof thoughts].trim() === ""}
              className={`flex-1 bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)] 
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                ${isComplete ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              {isComplete ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  {step === steps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completion Animation */}
      {isComplete && (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Great work!</h3>
            <p className="text-sm text-gray-600">
              You've completed a thought examination. This process helps build awareness of thinking patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}