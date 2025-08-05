import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/AuthContext";
import { Brain, BookOpen, Clock, Bell, Users, Heart, Wind, Zap } from "lucide-react";

interface UserPreferences {
  preferredInterventionTypes: string[];
  preferredContentTypes: string[];
  preferredDuration: number;
  preferredTimeOfDay: string;
  notificationPreferences: {
    mood_reminders: boolean;
    intervention_suggestions: boolean;
    weekly_insights: boolean;
    community_updates: boolean;
  };
}

const interventionTypes = [
  { id: 'breathing', label: 'Breathing Exercises', icon: <Wind className="w-4 h-4" /> },
  { id: 'meditation', label: 'Meditation & Mindfulness', icon: <Heart className="w-4 h-4" /> },
  { id: 'cbt', label: 'CBT & Thought Work', icon: <Brain className="w-4 h-4" /> },
  { id: 'grounding', label: 'Grounding & Crisis Tools', icon: <Zap className="w-4 h-4" /> },
];

const contentTypes = [
  { id: 'articles', label: 'Articles', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'audio', label: 'Audio Content', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'video', label: 'Video Content', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'community', label: 'Community Posts', icon: <Users className="w-4 h-4" /> },
];

const timeOfDayOptions = [
  { value: 'morning', label: 'Morning (6 AM - 11 AM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (6 PM - 11 PM)' },
  { value: 'anytime', label: 'Anytime' },
];

const durationOptions = [
  { value: 2, label: '2 minutes' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20+ minutes' },
];

export function PreferencesForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user is a guest (no email or demo user)
  const isGuestUser = !user?.email || user?.email === "demo@example.com" || user?.name === "demo_user";
  
  // Load existing preferences
  const { data: existingPreferences, isLoading } = useQuery({
    queryKey: ["/api/recommendations", user?.id, "preferences"],
    queryFn: async () => {
      if (!user) return null;
      const response = await fetch(`/api/recommendations/${user.id}/preferences`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!user,
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredInterventionTypes: ['breathing', 'meditation'],
    preferredContentTypes: ['articles', 'audio'],
    preferredDuration: 5,
    preferredTimeOfDay: 'morning',
    notificationPreferences: {
      mood_reminders: true,
      intervention_suggestions: true,
      weekly_insights: true,
      community_updates: false,
    },
  });

  // Update preferences when existing preferences are loaded
  useEffect(() => {
    if (existingPreferences) {
      setPreferences(existingPreferences);
    }
  }, [existingPreferences]);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const response = await fetch(`/api/recommendations/${user?.id}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (!response.ok) throw new Error('Failed to update preferences');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your recommendation preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInterventionTypeToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredInterventionTypes: prev.preferredInterventionTypes.includes(type)
        ? prev.preferredInterventionTypes.filter(t => t !== type)
        : [...prev.preferredInterventionTypes, type]
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredContentTypes: prev.preferredContentTypes.includes(type)
        ? prev.preferredContentTypes.filter(t => t !== type)
        : [...prev.preferredContentTypes, type]
    }));
  };

  const handleNotificationToggle = (key: keyof UserPreferences['notificationPreferences']) => {
    setPreferences(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key]
      }
    }));
  };

  const handleSave = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="relative">
        <div className={isGuestUser ? 'blur-sm' : ''}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-800">
            <Brain className="w-6 h-6 text-blue-500" />
            <span>Recommendation Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intervention Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Preferred Intervention Types</Label>
            <div className="grid grid-cols-2 gap-3">
              {interventionTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={preferences.preferredInterventionTypes.includes(type.id) ? "default" : "outline"}
                    className={`w-full justify-start gap-2 h-auto py-3 px-3 text-xs ${
                      preferences.preferredInterventionTypes.includes(type.id)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={() => handleInterventionTypeToggle(type.id)}
                  >
                    {type.icon}
                    <span className="text-xs leading-tight">{type.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Preferred Content Types</Label>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={preferences.preferredContentTypes.includes(type.id) ? "default" : "outline"}
                    className={`w-full justify-start gap-2 h-auto py-3 px-3 text-xs ${
                      preferences.preferredContentTypes.includes(type.id)
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={() => handleContentTypeToggle(type.id)}
                  >
                    {type.icon}
                    <span className="text-xs leading-tight">{type.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Duration and Time Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Preferred Duration</Label>
              <Select
                value={preferences.preferredDuration.toString()}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredDuration: parseInt(value) }))}
              >
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Preferred Time of Day</Label>
              <Select
                value={preferences.preferredTimeOfDay}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredTimeOfDay: value }))}
              >
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOfDayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Notification Preferences</Label>
            <div className="space-y-3">
              {Object.entries(preferences.notificationPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Label>
                      <p className="text-xs text-gray-500">
                        {key === 'mood_reminders' && 'Daily mood tracking reminders'}
                        {key === 'intervention_suggestions' && 'Personalized intervention suggestions'}
                        {key === 'weekly_insights' && 'Weekly mood pattern insights'}
                        {key === 'community_updates' && 'Community activity updates'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleNotificationToggle(key as keyof UserPreferences['notificationPreferences'])}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSave}
              disabled={updatePreferencesMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-xl"
            >
              {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
        </div>
        {/* Guest user overlay */}
        {isGuestUser && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  🎯 Personalize Your Experience
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Sign up to customize your recommendation preferences and get truly personalized wellness suggestions!
                </p>
                <Button
                  onClick={() => {
                    // Trigger auth modal
                    window.dispatchEvent(new CustomEvent('open-auth-modal'));
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  Personalize Now! 🎯
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 