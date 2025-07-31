import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Users, 
  BookOpen, 
  Play, 
  X, 
  Sparkles,
  Clock,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/AuthContext";

interface Recommendation {
  id?: number;
  type: 'content' | 'activity' | 'intervention' | 'community';
  title: string;
  description: string;
  contentType: string;
  reason: string;
  priority: number;
  contentId: string;
}

interface RecommendationsCardProps {
  className?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'intervention':
      return <Brain className="w-5 h-5" />;
    case 'content':
      return <BookOpen className="w-5 h-5" />;
    case 'community':
      return <Users className="w-5 h-5" />;
    case 'activity':
      return <Play className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'intervention':
      return 'from-blue-500 to-cyan-500';
    case 'content':
      return 'from-purple-500 to-pink-500';
    case 'community':
      return 'from-green-500 to-emerald-500';
    case 'activity':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getPriorityColor = (priority: number) => {
  if (priority >= 5) return 'bg-red-100 text-red-700 border-red-200';
  if (priority >= 4) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (priority >= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-blue-100 text-blue-700 border-blue-200';
};

export function RecommendationsCard({ className = "" }: RecommendationsCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dismissedRecommendations, setDismissedRecommendations] = useState<Set<number>>(new Set());
  const [dismissingRecommendations, setDismissingRecommendations] = useState<Set<number>>(new Set());

  // Check if user is a guest (no email or demo user)
  const isGuestUser = !user?.email || user?.email === "demo@example.com" || user?.name === "demo_user";

  // Load dismissed recommendations from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`dismissed-recommendations-${user.id}`);
      if (stored) {
        try {
          const dismissedIds = JSON.parse(stored);
          setDismissedRecommendations(new Set(dismissedIds));
        } catch (error) {
          console.error("Error loading dismissed recommendations:", error);
        }
      }
    }
  }, [user?.id]);

  // Save dismissed recommendations to localStorage whenever they change
  useEffect(() => {
    if (user?.id && dismissedRecommendations.size > 0) {
      localStorage.setItem(
        `dismissed-recommendations-${user.id}`, 
        JSON.stringify(Array.from(dismissedRecommendations))
      );
    }
  }, [dismissedRecommendations, user?.id]);

  // Clear old dismissed recommendations (older than 24 hours)
  useEffect(() => {
    if (user?.id) {
      const clearOldDismissed = () => {
        const stored = localStorage.getItem(`dismissed-recommendations-${user.id}`);
        if (stored) {
          try {
            const dismissedIds = JSON.parse(stored);
            // For now, we'll just clear all dismissed recommendations daily
            // In a more sophisticated implementation, you'd track timestamps
            const now = Date.now();
            const lastClear = localStorage.getItem(`last-clear-${user.id}`);
            const lastClearTime = lastClear ? parseInt(lastClear) : 0;
            
            // Clear dismissed recommendations once per day
            if (now - lastClearTime > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(`dismissed-recommendations-${user.id}`);
              localStorage.setItem(`last-clear-${user.id}`, now.toString());
              setDismissedRecommendations(new Set());
            }
          } catch (error) {
            console.error("Error clearing old dismissed recommendations:", error);
          }
        }
      };
      
      clearOldDismissed();
    }
  }, [user?.id]);

  // Fetch recommendations
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ["/api/recommendations", user?.id],
    queryFn: async () => {
      if (!user) return null;
      console.log("Fetching recommendations for user:", user.id);
      const response = await fetch(`/api/recommendations/${user.id}`);
      if (!response.ok) {
        console.error("Failed to fetch recommendations:", response.status);
        return null;
      }
      const data = await response.json();
      console.log("Received recommendations:", data);
      return data;
    },
    enabled: !!user,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Track recommendation interactions
  const interactionMutation = useMutation({
    mutationFn: async ({ recommendationId, action }: { recommendationId: number; action: 'clicked' | 'dismissed' }) => {
      const response = await fetch(`/api/recommendations/${recommendationId}/interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error('Failed to track interaction');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations", user?.id] });
    },
    onError: (error) => {
      console.error('Error tracking interaction:', error);
    },
  });

  const handleRecommendationClick = (recommendation: Recommendation) => {
    console.log("Recommendation clicked:", recommendation);
    
    // Track the interaction
    if (recommendation.id) {
      console.log("Tracking interaction for recommendation ID:", recommendation.id);
      interactionMutation.mutate({ recommendationId: recommendation.id, action: 'clicked' });
    } else {
      console.log("No recommendation ID found, skipping interaction tracking");
    }
    
    // Handle different recommendation types
    switch (recommendation.type) {
      case 'intervention':
        console.log("Handling intervention recommendation:", recommendation.contentType);
        // Trigger the specific intervention
        if (recommendation.contentType === 'breathing') {
          // You can dispatch a custom event or use a context to trigger breathing exercise
          window.dispatchEvent(new CustomEvent('trigger-breathing-exercise', { 
            detail: { contentId: recommendation.contentId } 
          }));
        } else if (recommendation.contentType === 'meditation') {
          window.dispatchEvent(new CustomEvent('trigger-meditation', { 
            detail: { contentId: recommendation.contentId } 
          }));
        }
        break;
      case 'activity':
        console.log("Handling activity recommendation:", recommendation.contentType);
        if (recommendation.contentType === 'mood_tracking') {
          // Trigger mood tracker
          window.dispatchEvent(new CustomEvent('trigger-mood-tracker'));
        } else if (recommendation.contentType === 'intervention') {
          // Generic intervention trigger
          window.dispatchEvent(new CustomEvent('trigger-breathing-exercise', { 
            detail: { contentId: recommendation.contentId } 
          }));
        }
        break;
      case 'community':
        console.log("Navigating to community");
        // Navigate to community
        window.location.href = '/community';
        break;
      case 'content':
        console.log("Navigating to resources");
        // Navigate to resources
        window.location.href = '/resources';
        break;
      default:
        console.log("Unknown recommendation type, defaulting to breathing exercise");
        // Default to breathing exercise for unknown types
        window.dispatchEvent(new CustomEvent('trigger-breathing-exercise', { 
          detail: { contentId: recommendation.contentId } 
        }));
        break;
    }
  };

  const handleDismiss = (recommendation: Recommendation) => {
    console.log("Dismissing recommendation:", recommendation.id);
    
    if (recommendation.id) {
      // Add to dismissing set immediately
      setDismissingRecommendations(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(recommendation.id!);
        return newSet;
      });
      
      // Track the interaction on server
      interactionMutation.mutate(
        { recommendationId: recommendation.id, action: 'dismissed' },
        {
          onSuccess: () => {
            // Remove from dismissing set on success
            setDismissingRecommendations(prev => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(recommendation.id!);
              return newSet;
            });
            
            // Update dismissed set with a small delay to allow animation to complete
            setTimeout(() => {
              setDismissedRecommendations(prev => {
                const newSet = new Set(Array.from(prev));
                newSet.add(recommendation.id!);
                return newSet;
              });
              
              // Update next recommendation for cycling
              const next = getNextRecommendation();
              setNextRecommendation(next);
            }, 300); // Match the animation duration
            
            // Show toast feedback
            toast({
              title: "Recommendation dismissed",
              description: "We'll show you different suggestions next time",
              duration: 2000,
            });
          },
          onError: () => {
            // Remove from dismissing set on error
            setDismissingRecommendations(prev => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(recommendation.id!);
              return newSet;
            });
            
            // Show error toast
            toast({
              title: "Failed to dismiss",
              description: "Please try again",
              variant: "destructive",
              duration: 2000,
            });
          }
        }
      );
    } else {
      // For recommendations without IDs, just show feedback
      toast({
        title: "Recommendation dismissed",
        description: "Thanks for the feedback!",
        duration: 2000,
      });
    }
  };

  const recommendations = recommendationsData?.recommendations || [];
  const activeRecommendations = recommendations.filter(
    (rec: Recommendation) => !dismissedRecommendations.has(rec.id || 0)
  );

  // Get the next recommendation to show when one is dismissed
  const getNextRecommendation = () => {
    const availableRecommendations = recommendations.filter(
      (rec: Recommendation) => !dismissedRecommendations.has(rec.id || 0)
    );
    return availableRecommendations[3] || null; // Get the 4th recommendation (index 3)
  };

  const [nextRecommendation, setNextRecommendation] = useState<Recommendation | null>(null);

  // Update next recommendation when active recommendations change
  useEffect(() => {
    const next = getNextRecommendation();
    setNextRecommendation(next);
  }, [activeRecommendations, recommendations]);

  if (!user || isLoading) {
    return null;
  }

  if (activeRecommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">For You</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                Personalized
              </Badge>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                🌱 Start Your Wellness Adventure
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Log your mood for 2 consecutive days to unlock magical personalized recommendations just for you!
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Day 1: Log your mood today</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Day 2: Log your mood tomorrow</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="relative">
        <div className={isGuestUser ? 'blur-sm' : ''}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">For You</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Personalized
                </Badge>
              </div>

              <div className="space-y-3">
            <AnimatePresence mode="wait">
              {activeRecommendations.slice(0, 3).map((recommendation: Recommendation, index: number) => (
                <motion.div
                  key={recommendation.id || recommendation.contentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(recommendation.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getTypeIcon(recommendation.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {recommendation.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(recommendation.priority)}`}
                            >
                              {recommendation.priority >= 4 ? 'High' : 'Medium'} Priority
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                            {recommendation.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Lightbulb className="w-3 h-3" />
                            <span className="italic">{recommendation.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (isGuestUser) {
                              toast({
                                title: "Sign up to try recommendations",
                                description: "Create an account to access personalized wellness tools",
                                duration: 3000,
                              });
                              return;
                            }
                            handleRecommendationClick(recommendation);
                          }}
                          disabled={isGuestUser}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs px-3 py-1 h-7 disabled:opacity-50"
                        >
                          {isGuestUser ? "Sign up" : "Try"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (isGuestUser) {
                              toast({
                                title: "Sign up for full features",
                                description: "Create an account to interact with recommendations",
                                duration: 3000,
                              });
                              return;
                            }
                            handleDismiss(recommendation);
                          }}
                          disabled={dismissingRecommendations.has(recommendation.id || 0) || isGuestUser}
                          className="text-gray-400 hover:text-gray-600 hover:bg-red-50 p-1 h-7 w-7 transition-all duration-200 disabled:opacity-50"
                          title={isGuestUser ? "Sign up to dismiss recommendations" : "Dismiss this recommendation"}
                        >
                          {dismissingRecommendations.has(recommendation.id || 0) ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full"
                            />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Show next recommendation if available and we have less than 3 visible */}
              {nextRecommendation && activeRecommendations.length < 3 && (
                <motion.div
                  key={`next-${nextRecommendation.id || nextRecommendation.contentId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(nextRecommendation.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getTypeIcon(nextRecommendation.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {nextRecommendation.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(nextRecommendation.priority)}`}
                            >
                              {nextRecommendation.priority >= 4 ? 'High' : 'Medium'} Priority
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                            {nextRecommendation.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Lightbulb className="w-3 h-3" />
                            <span className="italic">{nextRecommendation.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (isGuestUser) {
                              toast({
                                title: "Sign up to try recommendations",
                                description: "Create an account to access personalized wellness tools",
                                duration: 3000,
                              });
                              return;
                            }
                            handleRecommendationClick(nextRecommendation);
                          }}
                          disabled={isGuestUser}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs px-3 py-1 h-7 disabled:opacity-50"
                        >
                          {isGuestUser ? "Sign up" : "Try"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (isGuestUser) {
                              toast({
                                title: "Sign up for full features",
                                description: "Create an account to interact with recommendations",
                                duration: 3000,
                              });
                              return;
                            }
                            handleDismiss(nextRecommendation);
                          }}
                          disabled={dismissingRecommendations.has(nextRecommendation.id || 0) || isGuestUser}
                          className="text-gray-400 hover:text-gray-600 hover:bg-red-50 p-1 h-7 w-7 transition-all duration-200 disabled:opacity-50"
                          title={isGuestUser ? "Sign up to dismiss recommendations" : "Dismiss this recommendation"}
                        >
                          {dismissingRecommendations.has(nextRecommendation.id || 0) ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full"
                            />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
        </div>
        {/* Guest user overlay */}
        {isGuestUser && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  🎯 Your Perfect Wellness Match
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Sign up to discover personalized wellness recommendations that are just right for you!
                </p>
                <Button
                  onClick={() => {
                    // Trigger auth modal
                    window.dispatchEvent(new CustomEvent('open-auth-modal'));
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                  >
                    Discover Your Match! 🎯
                  </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 