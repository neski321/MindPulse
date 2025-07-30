import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Smile, Wind, Users, Phone, TriangleAlert, Brain, Flower2, Sparkles } from "lucide-react"
import { useLocation } from "wouter"
import { MoodTracker } from "@/components/mood-tracker"
import { BreathingExercise } from "@/components/breathing-exercise"
import { InterventionCard } from "@/components/intervention-card"
import { ProgressChart } from "@/components/progress-chart"
import { CrisisResources } from "@/components/crisis-resources"
import ThoughtCheckin from "@/components/thought-checkin"
import QuickMeditation from "@/components/quick-meditation"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/AuthContext"
import WelcomeModal from "../components/ui/welcome-modal";
import Magnet from "@/components/magnet";
import { useSettings } from "@/contexts/SettingsContext";
import { RecommendationsCard } from "@/components/recommendations-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const cardHoverVariants = {
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function Home() {
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const [, setLocation] = useLocation()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)
  const [showCrisisResources, setShowCrisisResources] = useState(false)
  const [showThoughtCheckin, setShowThoughtCheckin] = useState(false)
  const [showQuickMeditation, setShowQuickMeditation] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false);
  const { magnetEffect } = useSettings();
  const moodTrackerRef = useRef<HTMLDivElement>(null);

  // Show welcome modal for first-time users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // Listen for recommendation events
  useEffect(() => {
    const handleBreathingExercise = (event: CustomEvent) => {
      console.log('Triggering breathing exercise:', event.detail);
      setShowBreathingExercise(true);
    };

    const handleMeditation = (event: CustomEvent) => {
      console.log('Triggering meditation:', event.detail);
      setShowQuickMeditation(true);
    };

    const handleMoodTracker = () => {
      console.log('Triggering mood tracker');
      // Scroll to mood tracker
      if (moodTrackerRef.current) {
        moodTrackerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Add event listeners
    window.addEventListener('trigger-breathing-exercise', handleBreathingExercise as EventListener);
    window.addEventListener('trigger-meditation', handleMeditation as EventListener);
    window.addEventListener('trigger-mood-tracker', handleMoodTracker);

    // Cleanup
    return () => {
      window.removeEventListener('trigger-breathing-exercise', handleBreathingExercise as EventListener);
      window.removeEventListener('trigger-meditation', handleMeditation as EventListener);
      window.removeEventListener('trigger-mood-tracker', handleMoodTracker);
    };
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["/api/users", user?.id],
    queryFn: async () => {
      if (!user) return null
      const response = await fetch(`/api/users/${user.id}`)
      if (!response.ok) {
        const createResponse = await apiRequest("POST", "/api/users", {
          username: user.name || "demo_user",
          email: user.email || "demo@example.com",
          password: "demo123",
          name: user.name || "Sarah",
        })
        return createResponse.json()
      }
      return response.json()
    },
    enabled: !!user,
  })

  // Fetch user progress
  const { data: progressData } = useQuery({
    queryKey: ["/api/progress", user?.id],
    queryFn: async () => {
      if (!user) return null
      const response = await fetch(`/api/progress/${user.id}`)
      if (!response.ok) return null
      return response.json()
    },
    enabled: !!user,
  })

  // Fetch weekly mood data
  const { data: weeklyMoodData } = useQuery({
    queryKey: ["/api/mood-entries", user?.id, "weekly"],
    queryFn: async () => {
      if (!user) return { entries: [] }
      const response = await fetch(`/api/mood-entries/${user.id}/weekly`)
      if (!response.ok) return { entries: [] }
      return response.json()
    },
    enabled: !!user,
  })

  // Fetch community posts
  const { data: communityData } = useQuery({
    queryKey: ["/api/community/posts"],
    queryFn: async () => {
      const response = await fetch("/api/community/posts?limit=3")
      if (!response.ok) return { posts: [] }
      return response.json()
    },
  })

  // Mood tracking mutation
  const moodMutation = useMutation({
    mutationFn: async (moodData: { mood: string; intensity: number; note?: string }) => {
      if (!user) throw new Error("No user")
      const response = await apiRequest("POST", "/api/mood-entries", {
        userId: user.id,
        ...moodData,
      })
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] })
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] })
      if (data.recommendation) {
        toast({
          title: "Mood logged successfully!",
          description: `Recommendation: ${data.recommendation.title}`,
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Error logging mood",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleMoodSelect = (mood: string, intensity: number) => {
    setSelectedMood(mood)
    moodMutation.mutate({ mood, intensity })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading your wellness space...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to MindEase</h2>
          <p className="text-gray-600">Please log in or sign up to continue your wellness journey.</p>
        </motion.div>
      </div>
    )
  }

  const userName = userData?.user?.name || user.name || "there"
  const streak = progressData?.progress?.streak || 0

  return (
    <>
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
      <div className="min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto px-4 py-6 space-y-8"
        >
          {/* Header */}
          <motion.header
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 -mx-4 px-4 py-4 rounded-b-3xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindEase
                </h1>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">{userName[0]?.toUpperCase()}</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.header>

          {/* Welcome Section */}
          <motion.section variants={itemVariants} className="text-center space-y-6">
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-2xl"
            >
              <Smile className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Hello, {userName}
              </h2>
              <p className="text-gray-600 text-lg mt-2">How are you feeling today?</p>
            </motion.div>
          </motion.section>

          {/* Mood Tracker */}
          <motion.div variants={itemVariants} ref={moodTrackerRef}>
            <div className="relative flex justify-center items-center py-8 sm:py-10" style={{ minHeight: 220 }}>
              {magnetEffect ? (
                <Magnet padding={300} disabled={false} magnetStrength={10}>
                  <MoodTracker onMoodSelect={handleMoodSelect} selectedMood={selectedMood} isLoading={moodMutation.isPending} />
                </Magnet>
              ) : (
                <MoodTracker onMoodSelect={handleMoodSelect} selectedMood={selectedMood} isLoading={moodMutation.isPending} />
              )}
            </div>
          </motion.div>

          {/* Micro-Interventions */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Your Wellness Tools</h3>
            <div className="space-y-4">
              <motion.div whileHover="hover" whileTap="tap" variants={cardHoverVariants}>
                <InterventionCard
                  title="Breathing Exercise"
                  description="3 minutes • Stress Relief"
                  icon={<Wind className="w-5 h-5 text-white" />}
                  iconBg="bg-gradient-to-r from-green-400 to-emerald-500"
                  gradient="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                  onStart={() => setShowBreathingExercise(true)}
                />
              </motion.div>

              <motion.div whileHover="hover" whileTap="tap" variants={cardHoverVariants}>
                <InterventionCard
                  title="Thought Check-In"
                  description="5 minutes • CBT Exercise"
                  icon={<Brain className="w-5 h-5 text-white" />}
                  iconBg="bg-gradient-to-r from-blue-400 to-indigo-500"
                  gradient="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                  onStart={() => setShowThoughtCheckin(true)}
                />
              </motion.div>

              <motion.div whileHover="hover" whileTap="tap" variants={cardHoverVariants}>
                <InterventionCard
                  title="Quick Meditation"
                  description="3-5 minutes • Mindfulness"
                  icon={<Flower2 className="w-5 h-5 text-white" />}
                  iconBg="bg-gradient-to-r from-purple-400 to-pink-500"
                  gradient="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                  onStart={() => setShowQuickMeditation(true)}
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Recommendations Section */}
          <motion.div variants={itemVariants}>
            <RecommendationsCard />
          </motion.div>

          {/* Progress Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Your Progress</h3>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                      onClick={() => setLocation("/progress")}
                    >
                      View All
                    </Button>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                        className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </motion.div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{streak}-day streak</p>
                        <p className="text-sm text-gray-600">Daily check-ins</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.p
                        key={streak}
                        initial={{ scale: 1.2, color: "#f59e0b" }}
                        animate={{ scale: 1, color: "#f59e0b" }}
                        className="text-3xl font-bold"
                      >
                        {streak}
                      </motion.p>
                      <p className="text-xs text-gray-500">days</p>
                    </div>
                  </div>
                  <ProgressChart data={weeklyMoodData?.entries || []} />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Resources</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                  onClick={() => setLocation("/resources")}
                >
                  Browse All
                </Button>
              </motion.div>
            </div>
            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  title: "Articles",
                  desc: "Evidence-based insights",
                  color: "from-blue-400 to-blue-500",
                  bg: "from-blue-50 to-blue-100",
                },
                {
                  title: "Podcasts",
                  desc: "Expert conversations",
                  color: "from-green-400 to-green-500",
                  bg: "from-green-50 to-green-100",
                },
                {
                  title: "Community",
                  desc: "Anonymous support",
                  color: "from-purple-400 to-purple-500",
                  bg: "from-purple-50 to-purple-100",
                  icon: Users,
                },
                {
                  title: "Crisis Help",
                  desc: "24/7 support lines",
                  color: "from-red-400 to-red-500",
                  bg: "from-red-50 to-red-100",
                  icon: Phone,
                  onClick: () => setShowCrisisResources(true),
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="cursor-pointer"
                  onClick={item.onClick}
                >
                  <Card
                    className={`bg-gradient-to-br ${item.bg} border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden`}
                  >
                    <CardContent className="p-5">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-md`}
                      >
                        {item.icon ? (
                          <item.icon className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-5 h-5 bg-white rounded"></div>
                        )}
                      </motion.div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Community Support */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Community Support</h3>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-3 h-3 bg-green-400 rounded-full"
                    />
                    <span className="text-sm text-gray-500 font-medium">Active</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {communityData?.posts?.length > 0 ? (
                    <AnimatePresence>
                      {communityData.posts.slice(0, 1).map((post: any, index: number) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200"
                        >
                          <div className="flex items-start space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-md"
                            >
                              <span className="text-white text-sm font-bold">A</span>
                            </motion.div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                              <div className="flex items-center space-x-4 mt-3">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                                >
                                  <Heart className="w-3 h-3" />
                                  <span>{post.likes}</span>
                                </motion.button>
                                <span className="text-xs text-gray-400">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No community posts yet</p>
                      <p className="text-sm">Be the first to share your experience</p>
                    </motion.div>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-2xl py-3 font-medium shadow-lg"
                    onClick={() => setLocation("/community")}
                  >
                    Join the Conversation
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Resources */}
          <motion.div variants={itemVariants}>
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <TriangleAlert className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-red-900">Need Immediate Help?</h3>
                    <p className="text-sm text-red-700">We're here for you 24/7</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 rounded-2xl py-3 font-medium shadow-lg"
                    onClick={() => setShowCrisisResources(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    View Crisis Resources
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modals with smooth animations */}
          <AnimatePresence>
            {showBreathingExercise && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
              </motion.div>
            )}

            {showCrisisResources && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CrisisResources onClose={() => setShowCrisisResources(false)} />
              </motion.div>
            )}

            {showThoughtCheckin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-800">Thought Check-In</h2>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowThoughtCheckin(false)}
                          className="rounded-full"
                        >
                          ×
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-6">
                    <ThoughtCheckin onComplete={() => setShowThoughtCheckin(false)} />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {showQuickMeditation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-800">Quick Meditation</h2>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowQuickMeditation(false)}
                          className="rounded-full"
                        >
                          ×
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-6">
                    <QuickMeditation onComplete={() => setShowQuickMeditation(false)} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
