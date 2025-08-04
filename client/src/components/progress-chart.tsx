import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Smile, Meh, Frown, Zap, Clock, TrendingUp, Sun, Cloud, CloudRain, Sparkles, BarChart3 } from "lucide-react";

interface ProgressChartProps {
  data: Array<{
    mood: string;
    intensity: number;
    createdAt: string;
    secondaryMood?: string;
    note?: string;
  }>;
}

interface MoodDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: {
    day: string;
    fullDayName: string;
    entries: Array<{
      mood: string;
      intensity: number;
      createdAt: string;
      secondaryMood?: string;
      note?: string;
    }>;
  } | null;
}

const moodIcons: Record<string, JSX.Element> = {
  joy: <Heart className="w-5 h-5 text-red-600" />,
  calm: <Smile className="w-5 h-5 text-blue-600" />,
  neutral: <Meh className="w-5 h-5 text-gray-600" />,
  stressed: <Zap className="w-5 h-5 text-yellow-600" />,
  anxious: <Frown className="w-5 h-5 text-purple-600" />
};

const moodLabels: Record<string, string> = {
  joy: "Joy",
  calm: "Calm", 
  neutral: "Neutral",
  stressed: "Stressed",
  anxious: "Anxious"
};

const secondaryMoodLabels: Record<string, string> = {
  grateful: "Grateful",
  energetic: "Energetic", 
  hopeful: "Hopeful",
  excited: "Excited",
  peaceful: "Peaceful",
  content: "Content",
  relaxed: "Relaxed",
  centered: "Centered",
  tired: "Tired",
  distracted: "Distracted",
  indifferent: "Indifferent",
  balanced: "Balanced",
  overwhelmed: "Overwhelmed",
  frustrated: "Frustrated",
  pressured: "Pressured",
  tense: "Tense",
  worried: "Worried",
  panicked: "Panicked",
  uneasy: "Uneasy",
  fearful: "Fearful"
};

function MoodDetailModal({ isOpen, onClose, dayData }: MoodDetailModalProps) {
  const [hoveredEntry, setHoveredEntry] = useState<number | null>(null);

  if (!dayData) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMoodColor = (intensity: number) => {
    const colors = [
      "bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100",
      "bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100",
      "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100",
      "bg-gradient-to-br from-purple-100 via-violet-50 to-pink-100",
      "bg-gradient-to-br from-red-100 via-rose-50 to-pink-100",
    ];
    return colors[intensity - 1] || colors[0];
  };

  const getIntensityLabel = (intensity: number) => {
    const labels = ["Very Low", "Low", "Moderate", "High", "Very High"];
    return labels[intensity - 1] || "Unknown";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const entryVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[calc(100vw-2rem)] mx-auto max-h-[90vh] bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-2xl rounded-3xl backdrop-blur-sm">
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
          <DialogHeader className="text-center pb-6 border-b border-white/20 px-4">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <span className="flex flex-col items-start">
                <span className="text-base text-gray-600 font-medium">Your</span>
                <span className="text-lg">{dayData.fullDayName}'s Mood Journey</span>
              </span>
            </DialogTitle>
            <motion.div
              className="flex items-center justify-center gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 border-0 rounded-full px-3 py-1">
                <BarChart3 className="w-3 h-3 mr-1" />
                {dayData.entries.length} entries
              </Badge>
            </motion.div>
          </DialogHeader>
        </motion.div>

        <motion.div
          className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {dayData.entries.map((entry, index) => (
              <motion.div
                key={entry.createdAt}
                variants={entryVariants}
                layout
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredEntry(index)}
                onHoverEnd={() => setHoveredEntry(null)}
                className="group cursor-pointer"
              >
                <Card
                  className={`${getMoodColor(entry.intensity)} border-0 shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-sm border border-white/20`}
                >
                  <CardContent className="p-4">
                    {/* Header Section */}
                    <motion.div className="flex items-center justify-between mb-3" layout>
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                          whileHover={{
                            scale: 1.1,
                            rotate: 10,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          {moodIcons[entry.mood]}
                        </motion.div>
                        <div>
                          <motion.h3 className="font-bold text-gray-800 text-base" layout>
                            {moodLabels[entry.mood]}
                          </motion.h3>
                          {entry.secondaryMood && (
                            <motion.p
                              className="text-xs text-gray-600 font-medium"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {secondaryMoodLabels[entry.secondaryMood]}
                            </motion.p>
                          )}
                        </div>
                      </div>
                      <motion.div className="text-right" whileHover={{ scale: 1.05 }}>
                        <Badge className="bg-white/40 backdrop-blur-sm text-gray-800 border-0 rounded-2xl px-3 py-1 shadow-md text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(entry.createdAt)}
                        </Badge>
                      </motion.div>
                    </motion.div>

                    {/* Intensity Section */}
                    <motion.div className="flex items-center justify-between mb-3" layout>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-medium">Intensity:</span>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge className="bg-white/40 backdrop-blur-sm text-gray-800 border-0 rounded-2xl px-2 py-1 shadow-sm text-xs">
                            Level {entry.intensity}
                          </Badge>
                        </motion.div>
                        {/* Intensity dots visualization */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <motion.div
                              key={level}
                              className={`w-1.5 h-1.5 rounded-full ${
                                level <= entry.intensity
                                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                                  : "bg-white/40"
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * level }}
                              whileHover={{ scale: 1.3 }}
                            />
                          ))}
                        </div>
                      </div>
                      <motion.span
                        className="text-xs text-gray-600 font-medium bg-white/30 px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        {getIntensityLabel(entry.intensity)}
                      </motion.span>
                    </motion.div>

                    {/* Note Section */}
                    {entry.note && (
                      <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <motion.div
                          className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-inner"
                          whileHover={{
                            backgroundColor: "rgba(255,255,255,0.5)",
                            scale: 1.01,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.p
                            className="text-xs text-gray-700 leading-relaxed italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            "{entry.note}"
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Hover effect overlay */}
                    <AnimatePresence>
                      {hoveredEntry === index && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {dayData.entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No mood entries for this day</p>
              <p className="text-sm text-gray-500">Start tracking your mood to see your journey</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer with gentle encouragement */}
        <motion.div
          className="text-center pt-4 border-t border-white/20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-600 font-medium">🌟 Every emotion is valid and part of your journey</p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function ProgressChart({ data }: ProgressChartProps) {
  const [selectedDay, setSelectedDay] = useState<{
    day: string;
    fullDayName: string;
    entries: Array<{
      mood: string;
      intensity: number;
      createdAt: string;
      secondaryMood?: string;
      note?: string;
    }>;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weeklyData = useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fullDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const dayName = daysOfWeek[dayIndex];
      const fullDayName = fullDaysOfWeek[dayIndex];
      
      // Find mood entries for this day and sort by creation time
      const dayEntries = data.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.toDateString() === date.toDateString();
      }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      weekData.push({
        day: dayName,
        fullDayName: fullDayName,
        entries: dayEntries,
        hasData: dayEntries.length > 0
      });
    }

    return weekData;
  }, [data]);

  const getMoodColor = (intensity: number) => {
    if (intensity >= 4.5) return 'mood-gradient-joy'; // Joy
    if (intensity >= 3.5) return 'mood-gradient-calm'; // Calm
    if (intensity >= 2.5) return 'mood-gradient-neutral'; // Neutral
    if (intensity >= 1.5) return 'mood-gradient-stressed'; // Stressed
    return 'mood-gradient-anxious'; // Anxious
  };

  const handleDayClick = (day: any) => {
    if (day.hasData) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-600 mb-3">This week's mood trend</p>
      <div className="flex items-end justify-between space-x-1 h-16">
        {weeklyData.map((day, index) => (
          <motion.div 
            key={index} 
            className="flex-1 flex flex-col items-center"
            whileHover={{ scale: day.hasData ? 1.05 : 1 }}
            whileTap={{ scale: day.hasData ? 0.95 : 1 }}
          >
            <motion.div 
              className={`w-full h-16 flex flex-col justify-end cursor-pointer transition-all duration-300 ${
                day.hasData ? 'hover:shadow-lg' : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day.hasData ? (
                day.entries.map((entry, entryIndex) => {
                  const height = Math.max(8, (entry.intensity / 5) * 64);
                  const layerHeight = height / day.entries.length;
                  
                  return (
                    <motion.div
                      key={entryIndex}
                      className={`w-full rounded-t transition-all duration-300 ${
                        getMoodColor(entry.intensity)
                      }`}
                      style={{ 
                        height: `${layerHeight}px`,
                        marginBottom: entryIndex < day.entries.length - 1 ? '1px' : '0'
                      }}
                      whileHover={{ scale: 1.02 }}
                    />
                  );
                })
              ) : (
                <div 
                  className="w-full bg-gray-200 rounded-t"
                  style={{ height: '8px' }}
                />
              )}
            </motion.div>
            <span className="text-xs text-gray-500 mt-1">{day.day}</span>
          </motion.div>
        ))}
      </div>
      
      {weeklyData.every(day => !day.hasData) && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No mood data for this week</p>
          <p className="text-xs text-gray-400">Start tracking your mood to see trends</p>
        </div>
      )}

      <MoodDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayData={selectedDay}
      />
    </div>
  );
}
