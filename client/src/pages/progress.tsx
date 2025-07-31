import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Target, Brain, Award, Sparkles, Trophy, Star } from "lucide-react"
import { ProgressChart } from "@/components/progress-chart"
import { useAuth } from "@/AuthContext"

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
}

export default function Progress() {
  const { user, loading } = useAuth()

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

  const { data: moodData } = useQuery({
    queryKey: ["/api/mood-entries", user?.id],
    queryFn: async () => {
      if (!user) return { entries: [] }
      const response = await fetch(`/api/mood-entries/${user.id}`)
      if (!response.ok) return { entries: [] }
      return response.json()
    },
    enabled: !!user,
  })

  const { data: interventionData } = useQuery({
    queryKey: ["/api/interventions", user?.id],
    queryFn: async () => {
      if (!user) return { interventions: [] }
      const response = await fetch(`/api/interventions/${user.id}`)
      if (!response.ok) return { interventions: [] }
      return response.json()
    },
    enabled: !!user,
  })

  // Show a subtle loading indicator instead of blocking the entire page
  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="text-xs text-gray-600">Loading...</span>
        </div>
      </div>
    </motion.div>
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Track Your Progress</h2>
          <p className="text-gray-600">Sign in to view your mental wellness journey and achievements.</p>
        </motion.div>
      </div>
    )
  }

  const progress = progressData?.progress
  const insights = progressData?.insights
  const completedInterventions = interventionData?.interventions?.filter((i: any) => i.completed) || []

  return (
    <div className="min-h-screen">
      {loading && <LoadingIndicator />}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Your Progress
          </h1>
          <p className="text-gray-600 text-lg">Track your mental health journey</p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.div whileHover="hover" variants={cardHoverVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Award className="w-7 h-7 text-white" />
                </motion.div>
                <motion.p
                  key={progress?.streak}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {progress?.streak || 0}
                </motion.p>
                <p className="text-sm text-gray-600 font-medium">Day Streak</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover="hover" variants={cardHoverVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Target className="w-7 h-7 text-white" />
                </motion.div>
                <motion.p
                  key={progress?.totalInterventions}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {progress?.totalInterventions || 0}
                </motion.p>
                <p className="text-sm text-gray-600 font-medium">Interventions</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Mood Trends */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Mood Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ProgressChart data={moodData?.entries || []} />
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        {insights && (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Brain className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Insights
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">Pattern Analysis</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.pattern}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <h4 className="font-bold text-gray-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.recommendation}</p>
                </div>
                <div className="flex items-center justify-center">
                  <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 rounded-full px-4 py-2">
                    <Star className="w-3 h-3 mr-1" />
                    {Math.round(insights.confidence * 100)}% confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedInterventions.length > 0 ? (
                  completedInterventions.slice(0, 5).map((intervention: any, index: number) => (
                    <motion.div
                      key={intervention.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{intervention.title}</p>
                        <p className="text-sm text-gray-600">
                          {intervention.type} • {intervention.duration} min
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full">
                        <Trophy className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-600 mb-1">No completed interventions yet</p>
                    <p className="text-sm text-gray-500">Start your first intervention to see progress</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">This Week's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    label: "Check-ins",
                    value: moodData?.entries?.length || 0,
                    color: "from-blue-500 to-cyan-500",
                    icon: Calendar,
                  },
                  {
                    label: "Interventions completed",
                    value: completedInterventions.length,
                    color: "from-green-500 to-emerald-500",
                    icon: Target,
                  },
                  {
                    label: "Current streak",
                    value: `${progress?.streak || 0} days`,
                    color: "from-yellow-400 to-orange-400",
                    icon: Award,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
