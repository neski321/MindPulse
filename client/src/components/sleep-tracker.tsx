import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Moon, 
  Clock, 
  TrendingUp, 
  Bed, 
  Coffee, 
  Activity,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface SleepTrackerProps {
  onClose: () => void;
  onComplete: (sleepData: SleepData) => void;
}

interface SleepData {
  quality: number;
  duration: number;
  moodCorrelation: string;
  notes?: string;
  timestamp: Date;
}

const sleepQualityLabels = [
  "Very Poor",
  "Poor", 
  "Fair",
  "Good",
  "Excellent"
];

const sleepDurationLabels = [
  "Under 4h",
  "4-5h",
  "5-6h", 
  "6-7h",
  "7-8h",
  "8h+"
];

export function SleepTracker({ onClose, onComplete }: SleepTrackerProps) {
  const [step, setStep] = useState(1);
  const [sleepQuality, setSleepQuality] = useState<number[]>([3]);
  const [sleepDuration, setSleepDuration] = useState<number[]>([4]); // 6-7 hours default
  const [notes, setNotes] = useState("");
  const [moodCorrelation, setMoodCorrelation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate mood correlation based on sleep data
  useEffect(() => {
    const quality = sleepQuality[0];
    const duration = sleepDuration[0];
    
    let correlation = "";
    
    if (quality >= 4 && duration >= 4) {
      correlation = "Great sleep! This should positively impact your mood today.";
    } else if (quality >= 3 && duration >= 3) {
      correlation = "Decent sleep. You might feel slightly tired but should be okay.";
    } else if (quality <= 2 || duration <= 2) {
      correlation = "Poor sleep detected. Consider gentle activities and extra self-care today.";
    } else {
      correlation = "Mixed sleep quality. Pay attention to how you feel throughout the day.";
    }
    
    setMoodCorrelation(correlation);
  }, [sleepQuality, sleepDuration]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const sleepData: SleepData = {
      quality: sleepQuality[0],
      duration: sleepDuration[0],
      moodCorrelation,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(sleepData);
    setIsSubmitting(false);
  };

  const getSleepQualityColor = (quality: number) => {
    if (quality >= 4) return "text-green-600";
    if (quality >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getSleepDurationColor = (duration: number) => {
    if (duration >= 4) return "text-green-600";
    if (duration >= 3) return "text-yellow-600";
    return "text-red-600";
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
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Moon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Sleep Tracker</h2>
                <p className="text-sm text-gray-600">How did you sleep last night?</p>
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
          {/* Step 1: Sleep Quality */}
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
                  className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Bed className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How was your sleep quality?</h3>
                <p className="text-sm text-gray-600">Rate how well you slept last night</p>
              </div>

              <div className="space-y-4">
                <Slider
                  value={sleepQuality}
                  onValueChange={setSleepQuality}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Very Poor</span>
                  <span className={`font-medium ${getSleepQualityColor(sleepQuality[0])}`}>
                    {sleepQualityLabels[sleepQuality[0] - 1]}
                  </span>
                  <span>Excellent</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sleepQualityLabels[sleepQuality[0] - 1]} Sleep Quality
                    </p>
                    <p className="text-xs text-gray-600">
                      {sleepQuality[0] >= 4 
                        ? "Great! This should help your mood today."
                        : sleepQuality[0] >= 3
                        ? "Okay sleep. Consider extra self-care today."
                        : "Poor sleep detected. Be gentle with yourself today."
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 rounded-xl py-3 font-medium"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Sleep Duration */}
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
                  <Clock className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How long did you sleep?</h3>
                <p className="text-sm text-gray-600">Select your sleep duration</p>
              </div>

              <div className="space-y-4">
                <Slider
                  value={sleepDuration}
                  onValueChange={setSleepDuration}
                  max={6}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Under 4h</span>
                  <span className={`font-medium ${getSleepDurationColor(sleepDuration[0])}`}>
                    {sleepDurationLabels[sleepDuration[0] - 1]}
                  </span>
                  <span>8h+</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sleepDurationLabels[sleepDuration[0] - 1]} Sleep Duration
                    </p>
                    <p className="text-xs text-gray-600">
                      {sleepDuration[0] >= 4 
                        ? "Good sleep duration! This should support your energy levels."
                        : sleepDuration[0] >= 3
                        ? "Moderate sleep. You might feel a bit tired today."
                        : "Short sleep duration. Consider a nap or early bedtime tonight."
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

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

          {/* Step 3: Mood Correlation & Notes */}
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
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Sleep & Mood Connection</h3>
                <p className="text-sm text-gray-600">How your sleep might affect your mood today</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Mood Insight</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{moodCorrelation}</p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <Textarea
                  placeholder="How are you feeling this morning? Any sleep-related thoughts?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
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
                    "Save Sleep Log"
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