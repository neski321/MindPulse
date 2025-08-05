import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Activity, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X,
  CheckCircle,
  Clock,
  Heart,
  Brain
} from "lucide-react";

interface BodyScanMeditationProps {
  onClose: () => void;
  onComplete: (meditationData: MeditationData) => void;
}

interface MeditationData {
  duration: number;
  bodyPartsScanned: string[];
  relaxationLevel: number;
  notes?: string;
  timestamp: Date;
}

const bodyParts = [
  { id: "toes", name: "Toes", description: "Feel the weight of your toes" },
  { id: "feet", name: "Feet", description: "Notice the contact with the ground" },
  { id: "ankles", name: "Ankles", description: "Release any tension in your ankles" },
  { id: "calves", name: "Calves", description: "Feel your calf muscles relax" },
  { id: "knees", name: "Knees", description: "Let your knees soften" },
  { id: "thighs", name: "Thighs", description: "Release tension in your thigh muscles" },
  { id: "hips", name: "Hips", description: "Feel your hips settle comfortably" },
  { id: "abdomen", name: "Abdomen", description: "Notice your breath in your belly" },
  { id: "chest", name: "Chest", description: "Feel your chest rise and fall with breath" },
  { id: "shoulders", name: "Shoulders", description: "Let your shoulders drop" },
  { id: "arms", name: "Arms", description: "Feel your arms heavy and relaxed" },
  { id: "hands", name: "Hands", description: "Notice the sensation in your hands" },
  { id: "neck", name: "Neck", description: "Release any tension in your neck" },
  { id: "face", name: "Face", description: "Let your facial muscles soften" },
  { id: "head", name: "Head", description: "Feel your head supported and calm" }
];

const meditationPrompts = [
  "Take a deep breath in... and let it out slowly",
  "Feel the weight of your body against the surface",
  "Notice any areas of tension without trying to change them",
  "Simply observe the sensations in each part of your body",
  "If your mind wanders, gently bring it back to your body",
  "There's no right or wrong way to do this",
  "Be kind and patient with yourself throughout this practice"
];

export function BodyScanMeditation({ onClose, onComplete }: BodyScanMeditationProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [duration, setDuration] = useState<number[]>([4]); // 4 minutes default
  const [relaxationLevel, setRelaxationLevel] = useState<number[]>([3]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalTime = duration[0] * 60; // Convert to seconds

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
    if (isActive) {
      // Progress through body parts based on time
      const progress = (totalTime - timeRemaining) / totalTime;
      const newBodyPart = Math.floor(progress * bodyParts.length);
      setCurrentBodyPart(Math.min(newBodyPart, bodyParts.length - 1));
      
      // Mark completed parts
      const newCompletedParts = bodyParts.slice(0, newBodyPart + 1).map(part => part.id);
      setCompletedParts(newCompletedParts);
    }
  }, [timeRemaining, isActive, totalTime]);

  const handleStart = () => {
    setTimeRemaining(totalTime);
    setIsActive(true);
    setCurrentStep(1);
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
    setCurrentStep(0);
    setCurrentBodyPart(0);
    setCompletedParts([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    const meditationData: MeditationData = {
      duration: duration[0],
      bodyPartsScanned: completedParts,
      relaxationLevel: relaxationLevel[0],
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(meditationData);
    setIsSubmitting(false);
  };

  const getRelaxationLabel = (level: number) => {
    if (level >= 4) return "Very Relaxed";
    if (level >= 3) return "Relaxed";
    if (level >= 2) return "Somewhat Relaxed";
    return "Not Relaxed";
  };

  const getRelaxationColor = (level: number) => {
    if (level >= 4) return "text-green-600";
    if (level >= 3) return "text-blue-600";
    if (level >= 2) return "text-yellow-600";
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
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Body Scan Meditation</h2>
                <p className="text-sm text-gray-600">Progressive muscle relaxation</p>
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
          {/* Setup Screen */}
          {currentStep === 0 && (
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
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Prepare for Body Scan</h3>
                <p className="text-sm text-gray-600">Find a comfortable position and set your duration</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={10}
                    min={2}
                    step={1}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>2 min</span>
                    <span className="font-medium">{duration[0]} min</span>
                    <span>10 min</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Find a comfortable position</li>
                    <li>• Close your eyes or soften your gaze</li>
                    <li>• Follow the guided body scan</li>
                    <li>• Notice sensations without judgment</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 rounded-xl py-3 font-medium"
              >
                Start Body Scan
              </Button>
            </motion.div>
          )}

          {/* Meditation Screen */}
          {currentStep === 1 && (
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
                  <Activity className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {bodyParts[currentBodyPart]?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bodyParts[currentBodyPart]?.description}
                  </p>
                </div>

                <div className="text-3xl font-bold text-green-600">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(((totalTime - timeRemaining) / totalTime) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((totalTime - timeRemaining) / totalTime) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Body Parts Progress */}
              <div className="grid grid-cols-3 gap-2">
                {bodyParts.map((part, index) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: completedParts.includes(part.id) ? 1 : 0.5,
                      scale: completedParts.includes(part.id) ? 1 : 0.9
                    }}
                    className={`p-2 rounded-lg text-center text-xs ${
                      completedParts.includes(part.id)
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {part.name}
                  </motion.div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleStop}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipBack className="w-5 h-5" />
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
                  onClick={handleComplete}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Completion Screen */}
          {currentStep === 2 && (
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
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Body Scan Complete</h3>
                <p className="text-sm text-gray-600">How relaxed do you feel now?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Relaxation Level (1-5)</label>
                  <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setRelaxationLevel([level])}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                          relaxationLevel[0] === level
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-500 hover:border-blue-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelaxationLabel(relaxationLevel[0])}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Reflection (Optional)</label>
                  <textarea
                    placeholder="How did the body scan feel? What did you notice?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[80px] p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 rounded-xl py-3 font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Complete Session"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 