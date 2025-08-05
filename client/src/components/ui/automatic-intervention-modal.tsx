import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  Sparkles, 
  Zap,
  X,
  AlertTriangle,
  Clock,
  Star
} from "lucide-react";


interface AutomaticInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
  mood: string;
  intensity: number;
  secondaryMood?: string;
  selectedTools: { tool1: string; tool2: string; reasoning: string };
}

const toolConfigs = {
  "breathing-exercise": {
    title: "Breathing Exercise",
    description: "Immediate calming through controlled breathing",
    icon: Heart,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    duration: "2 min"
  },
  "sensory-grounding": {
    title: "Sensory Grounding",
    description: "5-4-3-2-1 grounding technique for acute distress",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bg: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    duration: "3 min"
  },
  "quick-meditation": {
    title: "Quick Meditation",
    description: "2-minute guided meditation for stress relief",
    icon: Brain,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    duration: "2 min"
  },
  "cbt-thought-record": {
    title: "CBT Thought Record",
    description: "Structured thought examination and reframing",
    icon: Brain,
    color: "from-indigo-400 to-purple-500",
    bg: "from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    duration: "5 min"
  },
  "crisis-safety-planning": {
    title: "Crisis Safety Planning",
    description: "Create personalized safety plans",
    icon: Shield,
    color: "from-red-400 to-pink-500",
    bg: "from-red-50 to-pink-50",
    border: "border-red-200",
    duration: "10 min"
  },
  "gratitude-journal": {
    title: "Gratitude Journal",
    description: "Shift focus to positive aspects",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    duration: "3 min"
  },
  "body-scan-meditation": {
    title: "Body Scan Meditation",
    description: "Progressive relaxation for physical tension",
    icon: Target,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    duration: "4 min"
  },
  "self-care-menu": {
    title: "Self-Care Menu",
    description: "AI-powered personalized suggestions",
    icon: Sparkles,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    duration: "2 min"
  }
};

export function AutomaticInterventionModal({ 
  isOpen, 
  onClose, 
  onToolSelect,
  mood, 
  intensity, 
  secondaryMood, 
  selectedTools 
}: AutomaticInterventionModalProps) {
  const handleToolSelect = (toolId: string) => {
    // Notify parent component about the selected tool first
    onToolSelect(toolId);
    // Close the automatic intervention modal after a short delay for smoother transition
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCloseModal = () => {
    onClose();
  };

  const getMoodDisplayName = (mood: string) => {
    const moodNames: Record<string, string> = {
      anxious: "Anxious",
      stressed: "Stressed",
      overwhelmed: "Overwhelmed",
      panicked: "Panicked",
      fearful: "Fearful",
      worried: "Worried",
      uneasy: "Uneasy",
      frustrated: "Frustrated",
      pressured: "Pressured",
      tense: "Tense"
    };
    return moodNames[mood] || mood;
  };

  const tool1Config = toolConfigs[selectedTools.tool1 as keyof typeof toolConfigs];
  const tool2Config = toolConfigs[selectedTools.tool2 as keyof typeof toolConfigs];

  if (!tool1Config || !tool2Config) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md mx-auto p-0 border-0 bg-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  We're Here to Help
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  We noticed you're feeling {getMoodDisplayName(mood)}
                  {secondaryMood && ` and ${getMoodDisplayName(secondaryMood)}`} 
                  at a high intensity. Here are some tools that might help:
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedTools.reasoning}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Tool 1 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 bg-gradient-to-r ${tool1Config.bg} rounded-2xl border ${tool1Config.border} cursor-pointer transition-all duration-200`}
                    onClick={() => handleToolSelect(selectedTools.tool1)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool1Config.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <tool1Config.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{tool1Config.title}</h3>
                        <p className="text-sm text-gray-600">{tool1Config.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{tool1Config.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tool 2 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 bg-gradient-to-r ${tool2Config.bg} rounded-2xl border ${tool2Config.border} cursor-pointer transition-all duration-200`}
                    onClick={() => handleToolSelect(selectedTools.tool2)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool2Config.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <tool2Config.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{tool2Config.title}</h3>
                        <p className="text-sm text-gray-600">{tool2Config.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{tool2Config.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={() => handleToolSelect(selectedTools.tool1)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Try Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
} 