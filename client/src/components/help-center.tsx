import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  BookOpen,
  Shield,
  Heart,
  Users,
  Zap,
  Star,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

interface HelpCenterProps {
  onClose: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  {
    id: "getting-started",
    question: "How do I get started with MindPulse?",
answer: "Welcome to MindPulse! Start by creating an account or using guest mode. Then, try logging your first mood entry using the mood tracker on the home screen. You'll receive personalized recommendations based on your mood patterns.",
    category: "Getting Started",
    tags: ["beginner", "mood", "tracking"]
  },
  {
    id: "mood-tracking",
    question: "How does mood tracking work?",
    answer: "Mood tracking helps you understand your emotional patterns. Select your primary mood (joy, calm, neutral, stressed, anxious) and intensity level (1-5). Add optional secondary emotions and notes. Our AI analyzes your patterns to provide personalized wellness recommendations.",
    category: "Features",
    tags: ["mood", "tracking", "ai", "recommendations"]
  },
  {
    id: "wellness-tools",
    question: "What wellness tools are available?",
    answer: "MindPulse offers 10+ evidence-based wellness tools including breathing exercises, meditation, CBT thought records, gratitude journaling, sleep tracking, habit formation, sensory grounding, and more. Access them through the 'Looking for More?' button on the home screen.",
    category: "Features",
    tags: ["tools", "wellness", "meditation", "breathing"]
  },
  {
    id: "privacy",
    question: "Is my data private and secure?",
    answer: "Yes! Your privacy is our top priority. All data is encrypted and stored securely. You can use the app anonymously, and we never share your personal information. Your mood entries and wellness activities are private to you.",
    category: "Privacy & Security",
    tags: ["privacy", "security", "data", "anonymous"]
  },
  {
    id: "recommendations",
    question: "How do personalized recommendations work?",
    answer: "Our AI analyzes your mood patterns, wellness tool usage, and preferences to suggest relevant activities. Recommendations become more accurate over time as you use the app more. You can also set preferences in Settings to customize your experience.",
    category: "Features",
    tags: ["ai", "recommendations", "personalization"]
  },
  {
    id: "crisis-support",
    question: "What if I'm in crisis?",
    answer: "If you're experiencing a mental health crisis, please seek immediate help. Use the 'Crisis Resources' button in Settings for 24/7 support lines. Remember: You're not alone, and professional help is available.",
    category: "Crisis Support",
    tags: ["crisis", "emergency", "support", "help"]
  },
  {
    id: "account-deletion",
    question: "How do I delete my account?",
    answer: "Go to Settings > Delete Account. Enter 'DELETE' to confirm. This will permanently remove all your data including mood entries, progress, and account information. This action cannot be undone.",
    category: "Account",
    tags: ["account", "delete", "data", "privacy"]
  },
  {
    id: "community",
    question: "How does the community feature work?",
    answer: "The community allows anonymous sharing and support. Posts are moderated for safety. You can share experiences, offer support, and connect with others on similar wellness journeys while maintaining your privacy.",
    category: "Features",
    tags: ["community", "anonymous", "support", "sharing"]
  }
];

const categories = [
  { id: "all", name: "All Topics", icon: BookOpen, color: "from-blue-400 to-cyan-500" },
  { id: "getting-started", name: "Getting Started", icon: Star, color: "from-green-400 to-emerald-500" },
  { id: "features", name: "Features", icon: Zap, color: "from-purple-400 to-violet-500" },
  { id: "privacy-security", name: "Privacy & Security", icon: Shield, color: "from-orange-400 to-amber-500" },
  { id: "crisis-support", name: "Crisis Support", icon: Heart, color: "from-red-400 to-pink-500" },
  { id: "account", name: "Account", icon: Users, color: "from-indigo-400 to-purple-500" }
];

export function HelpCenter({ onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || faq.category.toLowerCase().replace(" & ", "-").replace(" ", "-") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
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
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <HelpCircle className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Help Center
                </h2>
                <p className="text-sm text-gray-600">Find answers to your questions</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Frequently Asked Questions
              </h3>
              <span className="text-sm text-gray-500">
                {filteredFaqs.length} article{filteredFaqs.length !== 1 ? 's' : ''}
              </span>
            </div>

            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqToggle(faq.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{faq.question}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                          {faq.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFaqs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </motion.div>
            )}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border-2 border-dashed border-green-200"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Still need help?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="rounded-full border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      onClose();
                      // Trigger contact support modal
                      window.dispatchEvent(new CustomEvent('open-contact-support'));
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
} 