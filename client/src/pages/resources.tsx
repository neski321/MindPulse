import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Headphones, Users, Phone, ExternalLink, Heart, Brain, Lightbulb, Star } from "lucide-react"

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

export default function Resources() {
  const categories = [
    {
      title: "Mental Health Articles",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      lightColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      items: [
        {
          title: "Understanding Anxiety: A Beginner's Guide",
          description: "Learn about anxiety symptoms, causes, and coping strategies",
          readTime: "5 min read",
          tags: ["Anxiety", "Coping"],
          url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
          rating: 4.8,
        },
        {
          title: "The Science of Stress and How to Manage It",
          description: "Evidence-based techniques for stress reduction",
          readTime: "8 min read",
          tags: ["Stress", "Science"],
          url: "https://www.apa.org/topics/stress",
          rating: 4.9,
        },
        {
          title: "Building Resilience in Daily Life",
          description: "Practical strategies to strengthen mental resilience",
          readTime: "6 min read",
          tags: ["Resilience", "Daily Life"],
          url: "https://www.cdc.gov/mentalhealth/stress-coping/cope-with-stress/index.html",
          rating: 4.7,
        },
      ],
    },
    {
      title: "Guided Meditations & Audio",
      icon: Headphones,
      color: "from-green-500 to-emerald-500",
      lightColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      items: [
        {
          title: "10-Minute Morning Meditation",
          description: "Start your day with mindfulness and intention",
          readTime: "10 min",
          tags: ["Morning", "Mindfulness"],
          url: "https://www.headspace.com/meditation/10-minute-meditation",
          rating: 4.9,
        },
        {
          title: "Body Scan for Sleep",
          description: "Relax your body and mind before bedtime",
          readTime: "15 min",
          tags: ["Sleep", "Relaxation"],
          url: "https://www.calm.com/sleep/body-scan",
          rating: 4.8,
        },
        {
          title: "Anxiety Relief Breathing",
          description: "Guided breathing exercises for anxiety management",
          readTime: "7 min",
          tags: ["Anxiety", "Breathing"],
          url: "https://www.youtube.com/watch?v=YRPh_GaiL8s",
          rating: 4.6,
        },
      ],
    },
    {
      title: "Self-Help Tools",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-500",
      lightColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      items: [
        {
          title: "Thought Record Worksheet",
          description: "CBT tool for examining and reframing thoughts",
          readTime: "Interactive",
          tags: ["CBT", "Worksheet"],
          url: "https://www.psychologytools.com/resource/thought-record-sheet/",
          rating: 4.7,
        },
        {
          title: "Gratitude Journal Template",
          description: "Daily prompts for practicing gratitude",
          readTime: "5 min daily",
          tags: ["Gratitude", "Journal"],
          url: "https://www.happier.com/blog/gratitude-journal-template",
          rating: 4.8,
        },
        {
          title: "Mood Tracking Guide",
          description: "Learn effective mood tracking techniques",
          readTime: "3 min read",
          tags: ["Mood", "Tracking"],
          url: "https://www.verywellmind.com/mood-tracking-5323899",
          rating: 4.5,
        },
      ],
    },
    {
      title: "Educational Videos",
      icon: Brain,
      color: "from-orange-500 to-red-500",
      lightColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      items: [
        {
          title: "What Happens During a Panic Attack?",
          description: "Understanding panic attacks and coping strategies",
          readTime: "12 min",
          tags: ["Panic", "Education"],
          url: "https://www.ted.com/talks/dr_jennifer_akullian_what_happens_during_a_panic_attack",
          rating: 4.9,
        },
        {
          title: "The Mind-Body Connection",
          description: "How physical and mental health are interconnected",
          readTime: "8 min",
          tags: ["Mind-Body", "Health"],
          url: "https://www.harvard.edu/mind-body-medicine",
          rating: 4.8,
        },
        {
          title: "Healthy Sleep Habits",
          description: "Tips for improving sleep quality and mental health",
          readTime: "10 min",
          tags: ["Sleep", "Habits"],
          url: "https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep",
          rating: 4.7,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Resources
          </h1>
          <p className="text-gray-600 text-lg">Evidence-based tools and information for mental wellness</p>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.div whileHover="hover" whileTap="tap" variants={cardHoverVariants}>
            <Card
              className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => window.open("https://988lifeline.org/", "_blank")}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Phone className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Crisis Help</h3>
                <p className="text-xs text-gray-600">24/7 support lines</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover="hover" whileTap="tap" variants={cardHoverVariants}>
            <Card
              className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => window.open("https://www.nami.org/Support-Education/Support-Groups", "_blank")}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Users className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Community</h3>
                <p className="text-xs text-gray-600">Peer support</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Resource Categories */}
        <div className="space-y-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-xl font-bold text-gray-900">{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-5 bg-gradient-to-r ${category.lightColor} rounded-2xl border ${category.borderColor} hover:shadow-md transition-all duration-300 cursor-pointer`}
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900 flex-1 text-lg leading-tight">{item.title}</h4>
                          <motion.div whileHover={{ scale: 1.2 }} className="ml-3 flex-shrink-0">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </div>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 flex-wrap">
                            {item.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                className="bg-white/60 text-gray-700 border-gray-200 text-xs rounded-full px-3 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="font-medium">{item.rating}</span>
                            </div>
                            <span className="font-medium">{item.readTime}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Professional Help */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden border-l-4 border-blue-500">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Need Professional Help?</h3>
                  <p className="text-sm text-gray-600">Consider speaking with a mental health professional</p>
                </div>
              </div>
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-2xl py-4 text-lg font-medium shadow-lg"
                    onClick={() => window.open("https://www.psychologytoday.com/us/therapists", "_blank")}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Find a Therapist
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-2xl py-4 text-lg font-medium bg-transparent"
                    onClick={() => window.open("https://www.betterhelp.com/advice/therapy/", "_blank")}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Learn About Therapy
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    <strong className="font-bold">Important:</strong> These resources are for educational purposes and
                    are not a substitute for professional mental health care. If you're experiencing a mental health
                    crisis, please contact emergency services or a crisis helpline immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
