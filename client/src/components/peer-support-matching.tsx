import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  Shield, 
  Heart, 
  Clock, 
  Star, 
  X,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target
} from "lucide-react";

interface PeerSupportMatchingProps {
  onClose: () => void;
  onComplete: (supportData: SupportData) => void;
}

interface SupportData {
  topics: string[];
  comfortLevel: number;
  preferredFormat: string;
  availability: string;
  privacySettings: string[];
  notes?: string;
  timestamp: Date;
}

const supportTopics = [
  {
    id: "anxiety",
    name: "Anxiety & Stress",
    description: "Managing daily anxiety and stress",
    icon: AlertCircle,
    color: "from-yellow-400 to-orange-500",
    bg: "from-yellow-50 to-orange-50",
    participants: 45
  },
  {
    id: "depression",
    name: "Depression & Low Mood",
    description: "Coping with depression and mood challenges",
    icon: Heart,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    participants: 38
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Navigating personal and family relationships",
    icon: Users,
    color: "from-pink-400 to-rose-500",
    bg: "from-pink-50 to-rose-50",
    participants: 52
  },
  {
    id: "work-life",
    name: "Work-Life Balance",
    description: "Managing career and personal life",
    icon: Clock,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    participants: 41
  },
  {
    id: "self-care",
    name: "Self-Care & Wellness",
    description: "Building healthy habits and routines",
    icon: Star,
    color: "from-purple-400 to-violet-500",
    bg: "from-purple-50 to-violet-50",
    participants: 67
  },
  {
    id: "grief",
    name: "Grief & Loss",
    description: "Processing loss and difficult transitions",
    icon: Heart,
    color: "from-gray-400 to-slate-500",
    bg: "from-gray-50 to-slate-50",
    participants: 23
  }
];

const formatOptions = [
  {
    id: "one-on-one",
    name: "One-on-One Chat",
    description: "Private conversation with one person",
    icon: MessageCircle,
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: "small-group",
    name: "Small Group (3-5 people)",
    description: "Intimate group discussion",
    icon: Users,
    color: "from-green-400 to-emerald-500"
  },
  {
    id: "large-group",
    name: "Large Group (6-10 people)",
    description: "Community discussion and support",
    icon: Users,
    color: "from-purple-400 to-violet-500"
  }
];

const privacySettingsOptions = [
  {
    id: "anonymous",
    name: "Anonymous",
    description: "Use a nickname, no personal details"
  },
  {
    id: "pseudonym",
    name: "Pseudonym",
    description: "Use a chosen name, limited personal info"
  },
  {
    id: "verified",
    name: "Verified",
    description: "Show verified badge, more personal info"
  }
];

export function PeerSupportMatching({ onClose, onComplete }: PeerSupportMatchingProps) {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [comfortLevel, setComfortLevel] = useState<number[]>([3]);
  const [preferredFormat, setPreferredFormat] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string>("flexible");
  const [privacySettings, setPrivacySettings] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handlePrivacyToggle = (settingId: string) => {
    if (privacySettings.includes(settingId)) {
      setPrivacySettings(privacySettings.filter(s => s !== settingId));
    } else {
      setPrivacySettings([...privacySettings, settingId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedTopics.length === 0 || !preferredFormat) return;
    
    setIsSubmitting(true);
    
    const supportData: SupportData = {
      topics: selectedTopics,
      comfortLevel: comfortLevel[0],
      preferredFormat,
      availability,
      privacySettings,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(supportData);
    setIsSubmitting(false);
  };

  const getComfortLabel = (level: number) => {
    if (level >= 4) return "Very Comfortable";
    if (level >= 3) return "Comfortable";
    if (level >= 2) return "Somewhat Comfortable";
    return "Not Comfortable";
  };

  const getComfortColor = (level: number) => {
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
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Peer Support Matching</h2>
                <p className="text-sm text-gray-600">Connect with others who understand</p>
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
          {/* Step 1: Topics */}
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
                  className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">What would you like support with?</h3>
                <p className="text-sm text-gray-600">Select topics that resonate with your experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        selectedTopics.includes(topic.id)
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-200 hover:border-sky-300"
                      }`}
                      onClick={() => handleTopicToggle(topic.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${topic.color} rounded-xl flex items-center justify-center`}>
                            <topic.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                            <p className="text-sm text-gray-600">{topic.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              <span>{topic.participants} active</span>
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
                disabled={selectedTopics.length === 0}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Comfort Level */}
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
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How comfortable are you sharing?</h3>
                <p className="text-sm text-gray-600">This helps us match you with the right support level</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Not Comfortable</span>
                  <span className={`font-medium ${getComfortColor(comfortLevel[0])}`}>
                    {getComfortLabel(comfortLevel[0])}
                  </span>
                  <span>Very Comfortable</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setComfortLevel([level])}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                        comfortLevel[0] === level
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-500 hover:border-green-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <h4 className="font-medium text-gray-900 mb-2">Privacy & Safety:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You control how much you share</li>
                  <li>• All conversations are confidential</li>
                  <li>• You can leave any conversation at any time</li>
                  <li>• Professional moderators ensure safe spaces</li>
                </ul>
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Format & Privacy */}
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
                  <MessageCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">How would you like to connect?</h3>
                <p className="text-sm text-gray-600">Choose your preferred format and privacy level</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Conversation Format</h4>
                  <div className="space-y-3">
                    {formatOptions.map((format) => (
                      <motion.div
                        key={format.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            preferredFormat === format.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => setPreferredFormat(format.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${format.color} rounded-xl flex items-center justify-center`}>
                                <format.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{format.name}</h5>
                                <p className="text-sm text-gray-600">{format.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    {privacySettingsOptions.map((setting) => (
                      <motion.div
                        key={setting.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            privacySettings.includes(setting.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handlePrivacyToggle(setting.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{setting.name}</h5>
                                <p className="text-sm text-gray-600">{setting.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                  disabled={!preferredFormat || privacySettings.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Availability & Notes */}
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
                  className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Clock className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">When are you available?</h3>
                <p className="text-sm text-gray-600">Help us find the best time for your support</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "flexible", name: "Flexible", description: "Any time works for me" },
                    { id: "evenings", name: "Evenings", description: "After 6 PM" },
                    { id: "weekends", name: "Weekends", description: "Saturday and Sunday" },
                    { id: "mornings", name: "Mornings", description: "Before 12 PM" }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setAvailability(option.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        availability === option.id
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-200 text-gray-600 hover:border-orange-300"
                      }`}
                    >
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <textarea
                  placeholder="Anything else you'd like us to know about your preferences or needs?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We'll match you with compatible peers</li>
                  <li>• You'll receive connection requests within 24 hours</li>
                  <li>• You can accept or decline any matches</li>
                  <li>• Start conversations when you're ready</li>
                </ul>
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
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Finding matches...</span>
                    </div>
                  ) : (
                    "Find Support Matches"
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