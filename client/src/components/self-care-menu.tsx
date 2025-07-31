import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  Brain, 
  Activity, 
  Coffee, 
  Music, 
  BookOpen, 
  Users, 
  Home, 
  Zap,
  X,
  CheckCircle,
  Star,
  Clock,
  Target
} from "lucide-react";

interface SelfCareMenuProps {
  onClose: () => void;
  onComplete: (selfCareData: SelfCareData) => void;
}

interface SelfCareData {
  currentMood: string;
  selectedActivities: string[];
  duration: number;
  moodAfter: number;
  notes?: string;
  timestamp: Date;
}

const moodStates = [
  {
    id: "stressed",
    name: "Stressed",
    description: "Feeling overwhelmed or tense",
    icon: Brain,
    color: "from-red-400 to-pink-500",
    bg: "from-red-50 to-pink-50",
    activities: [
      "Deep breathing exercise",
      "Progressive muscle relaxation",
      "Take a warm bath",
      "Listen to calming music",
      "Go for a walk in nature",
      "Write in a journal",
      "Practice mindfulness",
      "Call a friend"
    ]
  },
  {
    id: "tired",
    name: "Tired",
    description: "Feeling exhausted or low energy",
    icon: Clock,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    activities: [
      "Take a power nap",
      "Gentle stretching",
      "Drink water and hydrate",
      "Step outside for fresh air",
      "Listen to upbeat music",
      "Light exercise",
      "Eat a healthy snack",
      "Practice self-massage"
    ]
  },
  {
    id: "sad",
    name: "Sad",
    description: "Feeling down or melancholic",
    icon: Heart,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    activities: [
      "Watch a funny video",
      "Call a loved one",
      "Write gratitude list",
      "Take a warm shower",
      "Listen to uplifting music",
      "Do something creative",
      "Cuddle with a pet",
      "Practice self-compassion"
    ]
  },
  {
    id: "anxious",
    name: "Anxious",
    description: "Feeling worried or nervous",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bg: "from-yellow-50 to-orange-50",
    activities: [
      "Grounding exercise (5-4-3-2-1)",
      "Box breathing technique",
      "Progressive muscle relaxation",
      "Focus on your senses",
      "Write down your worries",
      "Take a break from screens",
      "Gentle yoga or stretching",
      "Talk to someone you trust"
    ]
  },
  {
    id: "happy",
    name: "Happy",
    description: "Feeling good and positive",
    icon: Star,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    activities: [
      "Share your joy with others",
      "Do something you love",
      "Practice gratitude",
      "Help someone else",
      "Celebrate your wins",
      "Plan something fun",
      "Express yourself creatively",
      "Savor the moment"
    ]
  }
];

const quickActions = [
  {
    id: "breathing",
    name: "Quick Breathing",
    duration: "2 min",
    icon: Activity,
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: "stretching",
    name: "Gentle Stretching",
    duration: "5 min",
    icon: Activity,
    color: "from-green-400 to-emerald-500"
  },
  {
    id: "music",
    name: "Calming Music",
    duration: "3 min",
    icon: Music,
    color: "from-purple-400 to-violet-500"
  },
  {
    id: "journaling",
    name: "Quick Journal",
    duration: "4 min",
    icon: BookOpen,
    color: "from-orange-400 to-amber-500"
  }
];

export function SelfCareMenu({ onClose, onComplete }: SelfCareMenuProps) {
  const [step, setStep] = useState(1);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [duration, setDuration] = useState<number[]>([3]); // 3 minutes default
  const [moodAfter, setMoodAfter] = useState<number[]>([4]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivityToggle = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleSubmit = async () => {
    if (!currentMood || selectedActivities.length === 0) return;
    
    setIsSubmitting(true);
    
    const selfCareData: SelfCareData = {
      currentMood,
      selectedActivities,
      duration: duration[0],
      moodAfter: moodAfter[0],
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(selfCareData);
    setIsSubmitting(false);
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 4) return "Much Better";
    if (mood >= 3) return "Better";
    if (mood >= 2) return "Same";
    return "Worse";
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return "text-green-600";
    if (mood >= 3) return "text-blue-600";
    if (mood >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  const selectedMoodState = moodStates.find(mood => mood.id === currentMood);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Self-Care Menu</h2>
                <p className="text-sm text-gray-600">AI-powered care suggestions</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Current Mood */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How are you feeling?</h3>
                <p className="text-sm text-gray-600">Choose your current mood for personalized care suggestions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moodStates.map((mood) => (
                  <motion.div
                    key={mood.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        currentMood === mood.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setCurrentMood(mood.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${mood.color} rounded-xl flex items-center justify-center`}>
                            <mood.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{mood.name}</h4>
                            <p className="text-sm text-gray-600">{mood.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!currentMood}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Self-Care Activities */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Personalized Care Suggestions</h3>
                <p className="text-sm text-gray-600">Choose activities that feel right for you</p>
              </div>

              {selectedMoodState && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${selectedMoodState.color} rounded-lg flex items-center justify-center`}>
                        <selectedMoodState.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">For when you're feeling {selectedMoodState.name.toLowerCase()}</h4>
                        <p className="text-sm text-gray-600">{selectedMoodState.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMoodState.activities.map((activity, index) => (
                      <motion.div
                        key={activity}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            selectedActivities.includes(activity)
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-pink-300"
                          }`}
                          onClick={() => handleActivityToggle(activity)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${selectedMoodState.color} rounded-lg flex items-center justify-center`}>
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm text-gray-700">{activity}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedActivities.length === 0}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quick Actions */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Ready-to-use self-care activities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{action.name}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{action.duration}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">Your Care Plan:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Selected Activities:</span>
                    <span className="font-medium">{selectedActivities.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Duration:</span>
                    <span className="font-medium">{duration[0]} minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Mood After & Notes */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Star className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How do you feel now?</h3>
                <p className="text-sm text-gray-600">Rate your mood after your self-care activities</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Much Worse</span>
                  <span className={`font-medium ${getMoodColor(moodAfter[0])}`}>
                    {getMoodLabel(moodAfter[0])}
                  </span>
                  <span>Much Better</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMoodAfter([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        moodAfter[0] === level
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-500 hover:border-green-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Reflection (Optional)</label>
                <textarea
                  placeholder="How did the self-care activities make you feel? What worked best?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Complete Care Session"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 