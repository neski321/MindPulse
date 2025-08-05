import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts/ModalContext";
import { 
  Moon, 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  Sparkles, 
  Users, 
  BookOpen, 
  Activity, 
  Zap,
  X,
  Clock,
  Star
} from "lucide-react";
import { SleepTracker } from "@/components/sleep-tracker";
import { GratitudeJournal } from "@/components/gratitude-journal";
import { CBTThoughtRecord } from "@/components/cbt-thought-record";
import { BodyScanMeditation } from "@/components/body-scan-meditation";
import { CrisisSafetyPlanning } from "@/components/crisis-safety-planning";
import { HabitFormation } from "@/components/habit-formation";
import { SelfCareMenu } from "@/components/self-care-menu";
import { SensoryGrounding } from "@/components/sensory-grounding";
import { MoodPatternAnalyzer } from "@/components/mood-pattern-analyzer";
import { PeerSupportMatching } from "@/components/peer-support-matching";
import { ContactSupport } from "@/components/contact-support";

interface WellnessToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wellnessTools = [
  {
    id: "sleep-tracker",
    title: "Sleep Tracker",
    description: "Track sleep quality and correlate with mood patterns",
    icon: Moon,
    color: "from-indigo-400 to-purple-500",
    bg: "from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    duration: "2 min",
    status: "Available",
    priority: 1
  },
  {
    id: "gratitude-journal",
    title: "Gratitude Journal",
    description: "Daily gratitude practice to boost mood and resilience",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    duration: "3 min",
    status: "Available",
    priority: 2
  },
  {
    id: "cbt-worksheet",
    title: "CBT Thought Record",
    description: "Structured worksheet to challenge negative thoughts",
    icon: Brain,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    duration: "5 min",
    status: "Available",
    priority: 3
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    description: "Progressive relaxation to release physical tension",
    icon: Activity,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    duration: "4 min",
    status: "Available",
    priority: 4
  },
  {
    id: "crisis-safety",
    title: "Crisis Safety Planning",
    description: "Create personalized safety plans for difficult moments",
    icon: Shield,
    color: "from-red-400 to-pink-500",
    bg: "from-red-50 to-pink-50",
    border: "border-red-200",
    duration: "10 min",
    status: "Available",
    priority: 5
  },
  {
    id: "habit-tracker",
    title: "Habit Formation",
    description: "Track wellness habits and build sustainable routines",
    icon: Target,
    color: "from-orange-400 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    duration: "1 min",
    status: "Available",
    priority: 6
  },
  {
    id: "self-care-menu",
    title: "Self-Care Menu",
    description: "AI-powered suggestions based on your current state",
    icon: Sparkles,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    duration: "2 min",
    status: "Available",
    priority: 7
  },
  {
    id: "grounding-tools",
    title: "Sensory Grounding",
    description: "Immediate grounding techniques for acute distress",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bg: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    duration: "2 min",
    status: "Available",
    priority: 8
  },
  {
    id: "mood-analyzer",
    title: "Mood Pattern Analyzer",
    description: "AI insights into your emotional patterns and triggers",
    icon: Brain,
    color: "from-teal-400 to-cyan-500",
    bg: "from-teal-50 to-cyan-50",
    border: "border-teal-200",
    duration: "1 min",
    status: "Available",
    priority: 9
  },
  {
    id: "peer-support",
    title: "Peer Support Matching",
    description: "Connect with others experiencing similar challenges",
    icon: Users,
    color: "from-sky-400 to-blue-500",
    bg: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    duration: "5 min",
    status: "Available",
    priority: 10
  }
];

export function WellnessToolsModal({ isOpen, onClose }: WellnessToolsModalProps) {
  const { openModal, closeModal } = useModal();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showSleepTracker, setShowSleepTracker] = useState(false);
  const [showGratitudeJournal, setShowGratitudeJournal] = useState(false);
  const [showCBTThoughtRecord, setShowCBTThoughtRecord] = useState(false);
  const [showBodyScanMeditation, setShowBodyScanMeditation] = useState(false);
  const [showCrisisSafetyPlanning, setShowCrisisSafetyPlanning] = useState(false);
  const [showHabitFormation, setShowHabitFormation] = useState(false);
  const [showSelfCareMenu, setShowSelfCareMenu] = useState(false);
  const [showSensoryGrounding, setShowSensoryGrounding] = useState(false);
  const [showMoodPatternAnalyzer, setShowMoodPatternAnalyzer] = useState(false);
  const [showPeerSupportMatching, setShowPeerSupportMatching] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);

  // Sync modal state with isOpen prop
  useEffect(() => {
    if (isOpen) {
      openModal("wellness-tools-modal");
    } else {
      closeModal("wellness-tools-modal");
    }
  }, [isOpen, openModal, closeModal]);

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case "sleep-tracker":
        setShowSleepTracker(true);
        break;
      case "gratitude-journal":
        setShowGratitudeJournal(true);
        break;
      case "cbt-worksheet":
        setShowCBTThoughtRecord(true);
        break;
      case "body-scan":
        setShowBodyScanMeditation(true);
        break;
      case "crisis-safety":
        setShowCrisisSafetyPlanning(true);
        break;
      case "habit-tracker":
        setShowHabitFormation(true);
        break;
      case "self-care-menu":
        setShowSelfCareMenu(true);
        break;
      case "grounding-tools":
        setShowSensoryGrounding(true);
        break;
      case "mood-analyzer":
        setShowMoodPatternAnalyzer(true);
        break;
      case "peer-support":
        setShowPeerSupportMatching(true);
        break;
      default:
        setSelectedTool(toolId);
        // For now, just show a coming soon message
        setTimeout(() => {
          setSelectedTool(null);
        }, 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="wellness-tools-modal"
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
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Wellness Tools
                    </h2>
                    <p className="text-sm text-gray-600">Discover more ways to support your mental health</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
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
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wellnessTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className={`bg-gradient-to-br ${tool.bg} border-2 ${tool.border} hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden`}
                      onClick={() => handleToolClick(tool.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                          >
                            <tool.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{tool.title}</h3>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{tool.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs text-gray-500">#{tool.priority}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {tool.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                                {tool.status}
                              </span>
                              
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full"
                              >
                                Available
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Future Tools Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-dashed border-indigo-200 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full translate-y-8 -translate-x-8"></div>
                
                <div className="relative z-10 text-center space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      More Tools Coming Soon!
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                      We're constantly expanding our wellness toolkit. 
                      <span className="font-semibold text-indigo-600"> Reach out and tell us what you'd like to see here!</span>
                    </p>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200 shadow-sm cursor-pointer"
                    onClick={() => setShowContactSupport(true)}
                  >
                    <span className="text-xs font-medium text-indigo-600">💡</span>
                    <span className="text-xs font-medium text-gray-700">Suggest a new tool</span>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tool Components */}
      <AnimatePresence mode="wait">
        {showSleepTracker && (
          <SleepTracker
            key="sleep-tracker"
            onClose={() => setShowSleepTracker(false)}
            onComplete={(data) => {
              console.log("Sleep tracker completed:", data);
              setShowSleepTracker(false);
            }}
          />
        )}

        {showGratitudeJournal && (
          <GratitudeJournal
            key="gratitude-journal"
            onClose={() => setShowGratitudeJournal(false)}
            onComplete={(data) => {
              console.log("Gratitude journal completed:", data);
              setShowGratitudeJournal(false);
            }}
          />
        )}

        {showCBTThoughtRecord && (
          <CBTThoughtRecord
            key="cbt-thought-record"
            onClose={() => setShowCBTThoughtRecord(false)}
            onComplete={(data) => {
              console.log("CBT thought record completed:", data);
              setShowCBTThoughtRecord(false);
            }}
          />
        )}

        {showBodyScanMeditation && (
          <BodyScanMeditation
            key="body-scan-meditation"
            onClose={() => setShowBodyScanMeditation(false)}
            onComplete={(data) => {
              console.log("Body scan meditation completed:", data);
              setShowBodyScanMeditation(false);
            }}
          />
        )}

        {showCrisisSafetyPlanning && (
          <CrisisSafetyPlanning
            key="crisis-safety-planning"
            onClose={() => setShowCrisisSafetyPlanning(false)}
            onComplete={(data) => {
              console.log("Crisis safety planning completed:", data);
              setShowCrisisSafetyPlanning(false);
            }}
          />
        )}

        {showHabitFormation && (
          <HabitFormation
            key="habit-formation"
            onClose={() => setShowHabitFormation(false)}
            onComplete={(data) => {
              console.log("Habit formation completed:", data);
              setShowHabitFormation(false);
            }}
          />
        )}

        {showSelfCareMenu && (
          <SelfCareMenu
            key="self-care-menu"
            onClose={() => setShowSelfCareMenu(false)}
            onComplete={(data) => {
              console.log("Self care menu completed:", data);
              setShowSelfCareMenu(false);
            }}
          />
        )}

        {showSensoryGrounding && (
          <SensoryGrounding
            key="sensory-grounding"
            onClose={() => setShowSensoryGrounding(false)}
            onComplete={(data) => {
              console.log("Sensory grounding completed:", data);
              setShowSensoryGrounding(false);
            }}
          />
        )}

        {showMoodPatternAnalyzer && (
          <MoodPatternAnalyzer
            key="mood-pattern-analyzer"
            onClose={() => setShowMoodPatternAnalyzer(false)}
            onComplete={(data) => {
              console.log("Mood pattern analyzer completed:", data);
              setShowMoodPatternAnalyzer(false);
            }}
          />
        )}

        {showPeerSupportMatching && (
          <PeerSupportMatching
            key="peer-support-matching"
            onClose={() => setShowPeerSupportMatching(false)}
            onComplete={(data) => {
              console.log("Peer support matching completed:", data);
              setShowPeerSupportMatching(false);
            }}
          />
        )}

        {showContactSupport && (
          <ContactSupport
            key="contact-support"
            onClose={() => setShowContactSupport(false)}
            initialData={{
              subject: "New Wellness Tool Suggestion",
              message: "I would like to suggest a new wellness tool for MindPulse. Here are my ideas:\n\n• Tool name:\n• Description:\n• Why it would be helpful:\n• Any specific features you'd like to see:\n\nThank you for considering my suggestion!",
              priority: "normal"
            }}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
} 