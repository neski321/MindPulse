import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Sparkles, 
  PenTool, 
  CheckCircle, 
  X,
  Star,
  Lightbulb,
  Users,
  Home,
  Coffee,
  Music,
  BookOpen
} from "lucide-react";

interface GratitudeJournalProps {
  onClose: () => void;
  onComplete: (gratitudeData: GratitudeData) => void;
}

interface GratitudeData {
  entries: string[];
  moodBefore: number;
  moodAfter: number;
  notes?: string;
  timestamp: Date;
}

const gratitudePrompts = [
  {
    id: "people",
    title: "People",
    icon: Users,
    prompt: "Who are you grateful for today?",
    examples: ["A friend who listened", "A kind stranger", "Family support"]
  },
  {
    id: "experiences",
    title: "Experiences", 
    icon: Sparkles,
    prompt: "What experience made you smile today?",
    examples: ["A beautiful sunset", "A good conversation", "A moment of peace"]
  },
  {
    id: "simple_pleasures",
    title: "Simple Pleasures",
    icon: Coffee,
    prompt: "What small thing brought you joy?",
    examples: ["A warm cup of tea", "Fresh air", "A good book"]
  },
  {
    id: "growth",
    title: "Growth",
    icon: Star,
    prompt: "What are you learning or improving?",
    examples: ["A new skill", "Patience", "Self-compassion"]
  },
  {
    id: "comfort",
    title: "Comfort",
    icon: Home,
    prompt: "What makes you feel safe and comfortable?",
    examples: ["Your cozy bed", "A familiar routine", "A favorite song"]
  }
];

export function GratitudeJournal({ onClose, onComplete }: GratitudeJournalProps) {
  const [step, setStep] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [moodBefore, setMoodBefore] = useState<number[]>([3]);
  const [moodAfter, setMoodAfter] = useState<number[]>([4]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEntry = () => {
    if (currentEntry.trim()) {
      setGratitudeEntries([...gratitudeEntries, currentEntry.trim()]);
      setCurrentEntry("");
    }
  };

  const handleRemoveEntry = (index: number) => {
    setGratitudeEntries(gratitudeEntries.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (gratitudeEntries.length === 0) return;
    
    setIsSubmitting(true);
    
    const gratitudeData: GratitudeData = {
      entries: gratitudeEntries,
      moodBefore: moodBefore[0],
      moodAfter: moodAfter[0],
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(gratitudeData);
    setIsSubmitting(false);
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 4) return "Great";
    if (mood >= 3) return "Good";
    if (mood >= 2) return "Okay";
    return "Low";
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return "text-green-600";
    if (mood >= 3) return "text-yellow-600";
    if (mood >= 2) return "text-orange-600";
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
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Heart className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gratitude Journal</h2>
                <p className="text-sm text-gray-600">What are you thankful for today?</p>
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
          {/* Step 1: Mood Before */}
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
                  className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How are you feeling?</h3>
                <p className="text-sm text-gray-600">Rate your mood before practicing gratitude</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Low</span>
                  <span className={`font-medium ${getMoodColor(moodBefore[0])}`}>
                    {getMoodLabel(moodBefore[0])}
                  </span>
                  <span>Great</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMoodBefore([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        moodBefore[0] === level
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-500 hover:border-pink-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 rounded-xl py-3 font-medium"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Gratitude Prompts */}
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
                  className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Choose a gratitude prompt</h3>
                <p className="text-sm text-gray-600">What would you like to be grateful for?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {gratitudePrompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        selectedPrompt === prompt.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      onClick={() => setSelectedPrompt(prompt.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                            <prompt.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{prompt.title}</h4>
                            <p className="text-sm text-gray-600">{prompt.prompt}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {prompt.examples.map((example, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
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
                  disabled={!selectedPrompt}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Write Gratitude Entries */}
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
                  <PenTool className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Write your gratitude</h3>
                <p className="text-sm text-gray-600">Add 3 things you're grateful for</p>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="What are you grateful for?"
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    className="flex-1 min-h-[80px] resize-none"
                  />
                  <Button
                    onClick={handleAddEntry}
                    disabled={!currentEntry.trim()}
                    className="px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                  >
                    Add
                  </Button>
                </div>

                {gratitudeEntries.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Your gratitude list:</h4>
                    {gratitudeEntries.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{entry}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEntry(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
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
                  disabled={gratitudeEntries.length === 0}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
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
                  className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Lightbulb className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How do you feel now?</h3>
                <p className="text-sm text-gray-600">Rate your mood after practicing gratitude</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Low</span>
                  <span className={`font-medium ${getMoodColor(moodAfter[0])}`}>
                    {getMoodLabel(moodAfter[0])}
                  </span>
                  <span>Great</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMoodAfter([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        moodAfter[0] === level
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-blue-300"
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
                  placeholder="How did practicing gratitude make you feel?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Gratitude Entry"
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