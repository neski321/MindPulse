import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Eye, 
  Ear, 
  Hand, 
  Heart, 
  X,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface SensoryGroundingProps {
  onClose: () => void;
  onComplete: (groundingData: GroundingData) => void;
}

interface GroundingData {
  technique: string;
  duration: number;
  distressBefore: number;
  distressAfter: number;
  sensationsNoticed: string[];
  notes?: string;
  timestamp: Date;
}

const groundingTechniques = [
  {
    id: "54321",
    name: "5-4-3-2-1 Grounding",
    description: "Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste",
    icon: Eye,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    duration: 3,
    steps: [
      "5 things you can SEE",
      "4 things you can TOUCH",
      "3 things you can HEAR", 
      "2 things you can SMELL",
      "1 thing you can TASTE"
    ]
  },
  {
    id: "breathing",
    name: "Box Breathing",
    description: "Inhale for 4, hold for 4, exhale for 4, hold for 4",
    icon: Heart,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    duration: 2,
    steps: [
      "Inhale for 4 counts",
      "Hold for 4 counts",
      "Exhale for 4 counts", 
      "Hold for 4 counts"
    ]
  },
  {
    id: "senses",
    name: "Sensory Awareness",
    description: "Focus on each of your senses one by one",
    icon: Hand,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    duration: 4,
    steps: [
      "What do you feel on your skin?",
      "What do you hear around you?",
      "What do you see in detail?",
      "What do you smell in the air?",
      "What do you taste in your mouth?"
    ]
  },
  {
    id: "body-scan",
    name: "Quick Body Scan",
    description: "Notice sensations in different parts of your body",
    icon: Heart,
    color: "from-orange-400 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    duration: 3,
    steps: [
      "Feel your feet on the ground",
      "Notice your breathing",
      "Feel your hands and arms",
      "Notice your back and shoulders",
      "Feel your head and face"
    ]
  }
];

export function SensoryGrounding({ onClose, onComplete }: SensoryGroundingProps) {
  const [step, setStep] = useState(1);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [distressBefore, setDistressBefore] = useState<number[]>([4]);
  const [distressAfter, setDistressAfter] = useState<number[]>([2]);
  const [sensationsNoticed, setSensationsNoticed] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedTechniqueData = groundingTechniques.find(t => t.id === selectedTechnique);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive && selectedTechniqueData) {
      // Progress through steps based on time
      const progress = (selectedTechniqueData.duration * 60 - timeRemaining) / (selectedTechniqueData.duration * 60);
      const newStep = Math.floor(progress * selectedTechniqueData.steps.length);
      setCurrentExercise(Math.min(newStep, selectedTechniqueData.steps.length - 1));
    }
  }, [timeRemaining, isActive, selectedTechniqueData]);

  const handleStartExercise = () => {
    if (!selectedTechniqueData) return;
    setTimeRemaining(selectedTechniqueData.duration * 60);
    setIsActive(true);
    setCurrentExercise(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(0);
    setCurrentExercise(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!selectedTechnique) return;
    
    setIsSubmitting(true);
    
    const groundingData: GroundingData = {
      technique: selectedTechnique,
      duration: selectedTechniqueData?.duration || 3,
      distressBefore: distressBefore[0],
      distressAfter: distressAfter[0],
      sensationsNoticed: sensationsNoticed,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(groundingData);
    setIsSubmitting(false);
  };

  const getDistressLabel = (level: number) => {
    if (level >= 4) return "High Distress";
    if (level >= 3) return "Moderate Distress";
    if (level >= 2) return "Mild Distress";
    return "Low Distress";
  };

  const getDistressColor = (level: number) => {
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
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Sensory Grounding</h2>
                <p className="text-sm text-gray-600">Immediate grounding techniques</p>
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
          {/* Step 1: Distress Level */}
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
                  className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How distressed are you?</h3>
                <p className="text-sm text-gray-600">Rate your current level of distress</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Calm</span>
                  <span className={`font-medium ${getDistressColor(distressBefore[0])}`}>
                    {getDistressLabel(distressBefore[0])}
                  </span>
                  <span>Very Distressed</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDistressBefore([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        distressBefore[0] === level
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-gray-200 text-gray-500 hover:border-yellow-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 rounded-xl py-3 font-medium"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Choose Technique */}
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
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Choose a Grounding Technique</h3>
                <p className="text-sm text-gray-600">Select a technique that feels right for you</p>
              </div>

              <div className="space-y-4">
                {groundingTechniques.map((technique) => (
                  <motion.div
                    key={technique.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        selectedTechnique === technique.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedTechnique(technique.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${technique.color} rounded-xl flex items-center justify-center`}>
                            <technique.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{technique.name}</h4>
                            <p className="text-sm text-gray-600">{technique.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{technique.duration} min</span>
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
                  disabled={!selectedTechnique}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Exercise */}
          {step === 3 && selectedTechniqueData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ 
                    scale: isActive ? [1, 1.2, 1] : 1,
                    opacity: isActive ? [0.7, 1, 0.7] : 1
                  }}
                  transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <selectedTechniqueData.icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedTechniqueData.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTechniqueData.description}</p>
                </div>

                {isActive && (
                  <div className="text-3xl font-bold text-green-600">
                    {formatTime(timeRemaining)}
                  </div>
                )}
              </div>

              {/* Current Step */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                >
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">Current Step:</h4>
                    <p className="text-lg text-gray-700">{selectedTechniqueData.steps[currentExercise]}</p>
                  </div>
                </motion.div>
              )}

              {/* Progress */}
              {isActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(((selectedTechniqueData.duration * 60 - timeRemaining) / (selectedTechniqueData.duration * 60)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((selectedTechniqueData.duration * 60 - timeRemaining) / (selectedTechniqueData.duration * 60)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleStop}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
                
                {isActive ? (
                  <Button
                    onClick={handlePause}
                    className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  >
                    <Pause className="w-6 h-6" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              {!isActive && (
                <Button
                  onClick={handleStartExercise}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Start Exercise
                </Button>
              )}
            </motion.div>
          )}

          {/* Step 4: Results */}
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
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How do you feel now?</h3>
                <p className="text-sm text-gray-600">Rate your distress level after the grounding exercise</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Calm</span>
                  <span className={`font-medium ${getDistressColor(distressAfter[0])}`}>
                    {getDistressLabel(distressAfter[0])}
                  </span>
                  <span>Very Distressed</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDistressAfter([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        distressAfter[0] === level
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-500 hover:border-purple-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">What sensations did you notice? (Optional)</label>
                <textarea
                  placeholder="e.g., I felt my feet on the ground, I heard birds outside..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300 rounded-xl py-3 font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Complete Grounding Session"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 