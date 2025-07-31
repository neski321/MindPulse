import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  Scale, 
  RefreshCw, 
  CheckCircle, 
  X,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap
} from "lucide-react";

interface CBTThoughtRecordProps {
  onClose: () => void;
  onComplete: (cbtData: CBTData) => void;
}

interface CBTData {
  situation: string;
  thought: string;
  emotion: string;
  intensity: number;
  evidenceFor: string;
  evidenceAgainst: string;
  reframedThought: string;
  moodAfter: number;
  notes?: string;
  timestamp: Date;
}

const cognitiveDistortions = [
  {
    id: "all-or-nothing",
    title: "All-or-Nothing Thinking",
    description: "Seeing things as black or white, with no middle ground",
    example: "I'm either perfect or a complete failure"
  },
  {
    id: "overgeneralization",
    title: "Overgeneralization",
    description: "Making broad conclusions from single events",
    example: "I always mess up everything"
  },
  {
    id: "mental-filter",
    title: "Mental Filter",
    description: "Focusing only on negatives while ignoring positives",
    example: "I only remember my mistakes, not my successes"
  },
  {
    id: "catastrophizing",
    title: "Catastrophizing",
    description: "Expecting the worst possible outcome",
    example: "If I fail this test, my life is over"
  },
  {
    id: "emotional-reasoning",
    title: "Emotional Reasoning",
    description: "Believing feelings are facts",
    example: "I feel stupid, so I must be stupid"
  }
];

export function CBTThoughtRecord({ onClose, onComplete }: CBTThoughtRecordProps) {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState<number[]>([3]);
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [reframedThought, setReframedThought] = useState("");
  const [moodAfter, setMoodAfter] = useState<number[]>([4]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!situation.trim() || !thought.trim() || !emotion.trim()) return;
    
    setIsSubmitting(true);
    
    const cbtData: CBTData = {
      situation: situation.trim(),
      thought: thought.trim(),
      emotion: emotion.trim(),
      intensity: intensity[0],
      evidenceFor: evidenceFor.trim(),
      evidenceAgainst: evidenceAgainst.trim(),
      reframedThought: reframedThought.trim(),
      moodAfter: moodAfter[0],
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(cbtData);
    setIsSubmitting(false);
  };

  const getIntensityLabel = (level: number) => {
    if (level >= 4) return "Very Strong";
    if (level >= 3) return "Strong";
    if (level >= 2) return "Moderate";
    return "Mild";
  };

  const getIntensityColor = (level: number) => {
    if (level >= 4) return "text-red-600";
    if (level >= 3) return "text-orange-600";
    if (level >= 2) return "text-yellow-600";
    return "text-green-600";
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
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">CBT Thought Record</h2>
                <p className="text-sm text-gray-600">Challenge and reframe your thoughts</p>
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
          {/* Step 1: Situation */}
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
                  className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">What happened?</h3>
                <p className="text-sm text-gray-600">Describe the situation that triggered your thoughts</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Situation</label>
                <Textarea
                  placeholder="What happened? Where were you? Who was involved?"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!situation.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Thought & Emotion */}
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
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">What were you thinking?</h3>
                <p className="text-sm text-gray-600">Identify the thought that caused your emotional reaction</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Automatic Thought</label>
                  <Textarea
                    placeholder="What went through your mind? What did you tell yourself?"
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Emotion</label>
                  <Textarea
                    placeholder="How did you feel? (e.g., anxious, sad, angry, ashamed)"
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Intensity (1-5)</label>
                  <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setIntensity([level])}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                          intensity[0] === level
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 text-gray-500 hover:border-purple-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getIntensityLabel(intensity[0])} intensity
                  </p>
                </div>
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
                  disabled={!thought.trim() || !emotion.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Evidence */}
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
                  <Search className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Examine the evidence</h3>
                <p className="text-sm text-gray-600">Look for facts that support or contradict your thought</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Evidence FOR your thought</label>
                  <Textarea
                    placeholder="What facts support this thought? What makes you believe it's true?"
                    value={evidenceFor}
                    onChange={(e) => setEvidenceFor(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Evidence AGAINST your thought</label>
                  <Textarea
                    placeholder="What facts contradict this thought? What evidence suggests it might not be true?"
                    value={evidenceAgainst}
                    onChange={(e) => setEvidenceAgainst(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
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
                  disabled={!evidenceFor.trim() || !evidenceAgainst.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Reframe */}
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
                  className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <RefreshCw className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Reframe your thought</h3>
                <p className="text-sm text-gray-600">Create a more balanced and realistic thought</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Balanced Thought</label>
                  <Textarea
                    placeholder="Based on the evidence, what's a more balanced way to think about this?"
                    value={reframedThought}
                    onChange={(e) => setReframedThought(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Tips for reframing:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Consider both sides of the evidence</li>
                    <li>• Be kind and realistic with yourself</li>
                    <li>• Focus on what you can control</li>
                    <li>• Use "and" instead of "but"</li>
                  </ul>
                </div>
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
                  onClick={() => setStep(5)}
                  disabled={!reframedThought.trim()}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Mood After & Notes */}
          {step === 5 && (
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
                  <Lightbulb className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How do you feel now?</h3>
                <p className="text-sm text-gray-600">Rate your mood after reframing your thought</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Much Worse</span>
                  <span className={`font-medium ${getIntensityColor(moodAfter[0])}`}>
                    {getIntensityLabel(moodAfter[0])}
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
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 text-gray-500 hover:border-teal-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Reflection (Optional)</label>
                <Textarea
                  placeholder="What did you learn from this exercise?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Thought Record"
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