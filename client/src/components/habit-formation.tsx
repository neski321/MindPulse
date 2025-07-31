import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  CheckCircle, 
  X,
  Plus,
  Trash2,
  Calendar,
  Flame,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Heart,
  Brain,
  Activity
} from "lucide-react";

interface HabitFormationProps {
  onClose: () => void;
  onComplete: (habitData: HabitData) => void;
}

interface HabitData {
  habits: Habit[];
  currentStreaks: Record<string, number>;
  totalCompletions: number;
  notes?: string;
  timestamp: Date;
}

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  timeOfDay: string;
  trigger: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
}

const habitCategories = [
  {
    id: "physical",
    name: "Physical Wellness",
    icon: Activity,
    color: "from-green-400 to-emerald-500",
    bg: "from-green-50 to-emerald-50",
    examples: ["Exercise", "Walking", "Stretching", "Hydration"]
  },
  {
    id: "mental",
    name: "Mental Wellness", 
    icon: Brain,
    color: "from-blue-400 to-cyan-500",
    bg: "from-blue-50 to-cyan-50",
    examples: ["Meditation", "Journaling", "Reading", "Learning"]
  },
  {
    id: "emotional",
    name: "Emotional Wellness",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bg: "from-pink-50 to-rose-50",
    examples: ["Gratitude", "Self-care", "Social connection", "Creativity"]
  },
  {
    id: "sleep",
    name: "Sleep & Recovery",
    icon: Clock,
    color: "from-indigo-400 to-purple-500",
    bg: "from-indigo-50 to-purple-50",
    examples: ["Bedtime routine", "Screen-free time", "Relaxation", "Consistent sleep"]
  }
];

const frequencyOptions = [
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "weekly", label: "Weekly", description: "Once a week" },
  { value: "weekdays", label: "Weekdays", description: "Monday to Friday" },
  { value: "custom", label: "Custom", description: "Set your own schedule" }
];

const timeOfDayOptions = [
  { value: "morning", label: "Morning", description: "Start your day right" },
  { value: "afternoon", label: "Afternoon", description: "Midday boost" },
  { value: "evening", label: "Evening", description: "Wind down routine" },
  { value: "flexible", label: "Flexible", description: "Whenever works best" }
];

export function HabitFormation({ onClose, onComplete }: HabitFormationProps) {
  const [step, setStep] = useState(1);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [habitName, setHabitName] = useState("");
  const [habitFrequency, setHabitFrequency] = useState("daily");
  const [habitTimeOfDay, setHabitTimeOfDay] = useState("morning");
  const [habitTrigger, setHabitTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddHabit = () => {
    if (!habitName.trim() || !selectedCategory) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      category: selectedCategory,
      frequency: habitFrequency,
      timeOfDay: habitTimeOfDay,
      trigger: habitTrigger.trim(),
      streak: 0,
      completedToday: false,
      createdAt: new Date()
    };

    setHabits([...habits, newHabit]);
    setHabitName("");
    setHabitTrigger("");
    setSelectedCategory(null);
  };

  const handleCompleteHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completedToday: true, streak: habit.streak + 1 }
        : habit
    ));
  };

  const handleRemoveHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const handleSubmit = async () => {
    if (habits.length === 0) return;
    
    setIsSubmitting(true);
    
    const currentStreaks: Record<string, number> = {};
    habits.forEach(habit => {
      currentStreaks[habit.id] = habit.streak;
    });

    const habitData: HabitData = {
      habits,
      currentStreaks,
      totalCompletions: habits.filter(h => h.completedToday).length,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(habitData);
    setIsSubmitting(false);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = habitCategories.find(c => c.id === categoryId);
    return category?.icon || Target;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = habitCategories.find(c => c.id === categoryId);
    return category?.color || "from-gray-400 to-gray-500";
  };

  const getCategoryBg = (categoryId: string) => {
    const category = habitCategories.find(c => c.id === categoryId);
    return category?.bg || "from-gray-50 to-gray-100";
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
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Target className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Habit Formation</h2>
                <p className="text-sm text-gray-600">Build sustainable wellness routines</p>
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
          {/* Step 1: Choose Category */}
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
                  className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Choose a Wellness Category</h3>
                <p className="text-sm text-gray-600">What type of habit would you like to build?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habitCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer border-2 transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {category.examples.map((example) => (
                                <Badge key={example} variant="secondary" className="text-xs">
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

              <Button
                onClick={() => setStep(2)}
                disabled={!selectedCategory}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Define Habit */}
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
                  <Plus className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Define Your Habit</h3>
                <p className="text-sm text-gray-600">Make it specific and actionable</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Habit Name</label>
                  <Input
                    placeholder="e.g., Morning meditation, Evening walk, Daily gratitude"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Frequency</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setHabitFrequency(option.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          habitFrequency === option.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs opacity-75">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Time of Day</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {timeOfDayOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setHabitTimeOfDay(option.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          habitTimeOfDay === option.value
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-green-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs opacity-75">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Trigger (Optional)</label>
                  <Input
                    placeholder="e.g., After brushing teeth, Before bed, When I wake up"
                    value={habitTrigger}
                    onChange={(e) => setHabitTrigger(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A trigger helps you remember to do the habit
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
                  onClick={handleAddHabit}
                  disabled={!habitName.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Add Habit
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Habit Dashboard */}
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
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Your Habits Dashboard</h3>
                <p className="text-sm text-gray-600">Track your progress and build streaks</p>
              </div>

              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">No habits yet</h4>
                  <p className="text-sm text-gray-600 mb-4">Add your first habit to get started</p>
                  <Button
                    onClick={() => setStep(1)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  >
                    Add Habit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {habits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(habit.category)} rounded-xl flex items-center justify-center`}>
                            {React.createElement(getCategoryIcon(habit.category), { className: "w-5 h-5 text-white" })}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{habit.frequency}</span>
                              <span>•</span>
                              <span>{habit.timeOfDay}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-xs">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="font-medium">{habit.streak}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveHabit(habit.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {habit.trigger && (
                        <p className="text-xs text-gray-600 mb-3">
                          Trigger: {habit.trigger}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {habit.completedToday ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Completed today</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleCompleteHabit(habit.id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 text-sm"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Created {habit.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Add More Habits
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={habits.length === 0}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Reflection & Notes */}
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
                  <Star className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Habit Formation Complete!</h3>
                <p className="text-sm text-gray-600">Reflect on your habit-building journey</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-2">Your Habit Summary:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Habits:</span>
                      <span className="font-medium">{habits.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed Today:</span>
                      <span className="font-medium">{habits.filter(h => h.completedToday).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Streaks:</span>
                      <span className="font-medium">{habits.reduce((sum, h) => sum + h.streak, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Reflection (Optional)</label>
                  <Textarea
                    placeholder="How do you feel about your new habits? Any challenges or successes?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
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
                  "Save Habit Plan"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 