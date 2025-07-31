import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Clock, 
  X,
  CheckCircle,
  Star,
  AlertTriangle,
  Lightbulb,
  Target
} from "lucide-react";

interface MoodPatternAnalyzerProps {
  onClose: () => void;
  onComplete: (analysisData: AnalysisData) => void;
}

interface AnalysisData {
  patterns: MoodPattern[];
  triggers: string[];
  recommendations: string[];
  insights: string[];
  notes?: string;
  timestamp: Date;
}

interface MoodPattern {
  type: string;
  description: string;
  frequency: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number;
}

// Mock data for demonstration
const mockMoodData = [
  { day: "Mon", mood: 4, activities: ["work", "exercise"] },
  { day: "Tue", mood: 3, activities: ["work", "social"] },
  { day: "Wed", mood: 5, activities: ["exercise", "hobby"] },
  { day: "Thu", mood: 2, activities: ["work", "stress"] },
  { day: "Fri", mood: 4, activities: ["work", "social"] },
  { day: "Sat", mood: 5, activities: ["leisure", "social"] },
  { day: "Sun", mood: 3, activities: ["rest", "planning"] }
];

const patternTypes = [
  {
    id: "weekly-rhythm",
    name: "Weekly Rhythm",
    description: "Your mood follows a weekly pattern",
    icon: Calendar,
    color: "from-blue-400 to-cyan-500",
    examples: ["Weekend boost", "Monday blues", "Midweek slump"]
  },
  {
    id: "activity-correlation",
    name: "Activity Correlation",
    description: "Certain activities affect your mood",
    icon: Activity,
    color: "from-green-400 to-emerald-500",
    examples: ["Exercise improves mood", "Social time helps", "Work stress impacts"]
  },
  {
    id: "time-patterns",
    name: "Time Patterns",
    description: "Your mood varies throughout the day",
    icon: Clock,
    color: "from-purple-400 to-violet-500",
    examples: ["Morning energy", "Afternoon dip", "Evening calm"]
  },
  {
    id: "trigger-events",
    name: "Trigger Events",
    description: "Specific events or situations affect you",
    icon: AlertTriangle,
    color: "from-red-400 to-pink-500",
    examples: ["Work deadlines", "Social interactions", "Weather changes"]
  }
];

export function MoodPatternAnalyzer({ onClose, onComplete }: MoodPatternAnalyzerProps) {
  const [step, setStep] = useState(1);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock analysis results
  const mockPatterns: MoodPattern[] = [
    {
      type: "Weekly Rhythm",
      description: "Your mood tends to be higher on weekends and lower midweek",
      frequency: "Weekly",
      impact: "neutral",
      confidence: 85
    },
    {
      type: "Activity Correlation", 
      description: "Exercise and social activities consistently improve your mood",
      frequency: "Daily",
      impact: "positive",
      confidence: 92
    },
    {
      type: "Time Patterns",
      description: "You experience an afternoon energy dip around 2-3 PM",
      frequency: "Daily", 
      impact: "negative",
      confidence: 78
    }
  ];

  const mockTriggers = [
    "Work deadlines and pressure",
    "Lack of sleep",
    "Social isolation",
    "Physical inactivity",
    "Poor nutrition"
  ];

  const mockRecommendations = [
    "Schedule exercise in the morning to boost daily mood",
    "Plan social activities for midweek to combat the slump",
    "Take short breaks during afternoon energy dips",
    "Establish a consistent sleep schedule",
    "Practice stress management techniques before deadlines"
  ];

  const mockInsights = [
    "Your mood is most stable when you maintain regular exercise",
    "Social connections have a strong positive impact on your wellbeing",
    "Work stress is your biggest challenge - consider boundary setting",
    "You respond well to routine and structure",
    "Your mood improves significantly with adequate sleep"
  ];

  const handlePatternToggle = (patternId: string) => {
    if (selectedPatterns.includes(patternId)) {
      setSelectedPatterns(selectedPatterns.filter(p => p !== patternId));
    } else {
      setSelectedPatterns([...selectedPatterns, patternId]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const analysisData: AnalysisData = {
      patterns: mockPatterns,
      triggers: mockTriggers,
      recommendations: mockRecommendations,
      insights: mockInsights,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(analysisData);
    setIsSubmitting(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive": return TrendingUp;
      case "negative": return TrendingDown;
      default: return Activity;
    }
  };

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
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Mood Pattern Analyzer</h2>
                <p className="text-sm text-gray-600">AI insights into your emotional patterns</p>
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
          {/* Step 1: Pattern Types */}
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
                  className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">What patterns interest you?</h3>
                <p className="text-sm text-gray-600">Select the types of patterns you'd like to analyze</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patternTypes.map((pattern) => (
                  <motion.div
                    key={pattern.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        selectedPatterns.includes(pattern.id)
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                      onClick={() => handlePatternToggle(pattern.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${pattern.color} rounded-xl flex items-center justify-center`}>
                            <pattern.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                            <p className="text-sm text-gray-600">{pattern.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {pattern.examples.map((example) => (
                                <Badge key={example} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={selectedPatterns.length === 0}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Analyze Patterns
              </Button>
            </motion.div>
          )}

          {/* Step 2: Analysis Results */}
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
                  className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Your Mood Patterns</h3>
                <p className="text-sm text-gray-600">AI analysis of your emotional patterns</p>
              </div>

              <div className="space-y-4">
                {mockPatterns.map((pattern, index) => {
                  const ImpactIcon = getImpactIcon(pattern.impact);
                  return (
                    <motion.div
                      key={pattern.type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${pattern.impact === 'positive' ? 'from-green-400 to-emerald-500' : pattern.impact === 'negative' ? 'from-red-400 to-pink-500' : 'from-yellow-400 to-orange-500'} rounded-lg flex items-center justify-center`}>
                            <ImpactIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{pattern.type}</h4>
                            <p className="text-sm text-gray-600">{pattern.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{pattern.frequency}</div>
                          <div className={`text-sm font-medium ${getImpactColor(pattern.impact)}`}>
                            {pattern.confidence}% confidence
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Triggers & Insights */}
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
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Lightbulb className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Triggers & Insights</h3>
                <p className="text-sm text-gray-600">Understanding what affects your mood</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Common Triggers</h4>
                  <div className="space-y-2">
                    {mockTriggers.map((trigger, index) => (
                      <motion.div
                        key={trigger}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-700">{trigger}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Key Insights</h4>
                  <div className="space-y-2">
                    {mockInsights.map((insight, index) => (
                      <motion.div
                        key={insight}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </motion.div>
                    ))}
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Recommendations */}
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
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Personalized Recommendations</h3>
                <p className="text-sm text-gray-600">Actionable steps based on your patterns</p>
              </div>

              <div className="space-y-4">
                {mockRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Recommendation {index + 1}</h4>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Reflection (Optional)</label>
                <textarea
                  placeholder="How do these patterns and insights resonate with you?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Analysis"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 