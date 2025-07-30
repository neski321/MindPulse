import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/AuthContext";
import { Brain, BookOpen, Clock, Bell, Users, Heart } from "lucide-react";

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
  { id: 'breathing', label: 'Breathing Exercises', icon: <Brain className="w-4 h-4" /> },
  { id: 'meditation', label: 'Meditation', icon: <Heart className="w-4 h-4" /> },
  { id: 'cbt', label: 'CBT Exercises', icon: <Brain className="w-4 h-4" /> },
  { id: 'grounding', label: 'Grounding Techniques', icon: <Brain className="w-4 h-4" /> },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
                    className={`w-full justify-start h-auto p-3 ${
                      preferences.preferredInterventionTypes.includes(type.id)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                    onClick={() => handleInterventionTypeToggle(type.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span className="text-sm">{type.label}</span>
                    </div>
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
                    className={`w-full justify-start h-auto p-3 ${
                      preferences.preferredContentTypes.includes(type.id)
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                    onClick={() => handleContentTypeToggle(type.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span className="text-sm">{type.label}</span>
                    </div>
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
    </motion.div>
  );
} 