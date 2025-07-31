import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  X, 
  MessageCircle,
  Phone,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  ExternalLink,
  Heart,
  Shield,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSupportProps {
  onClose: () => void;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  action: () => void;
  external?: boolean;
}

export function ContactSupport({ onClose }: ContactSupportProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: "email",
      title: "Email Support",
      description: "Get a response within 24 hours",
      icon: Mail,
      color: "from-blue-400 to-cyan-500",
      bg: "from-blue-50 to-cyan-50",
      action: () => setSelectedMethod("email")
    },
    {
      id: "chat",
      title: "Live Chat",
      description: "Available 9 AM - 6 PM EST",
      icon: MessageCircle,
      color: "from-green-400 to-emerald-500",
      bg: "from-green-50 to-emerald-50",
      action: () => {
        toast({
          title: "Live Chat",
          description: "Live chat feature coming soon! For now, please use email support.",
        });
      }
    },
    {
      id: "phone",
      title: "Phone Support",
      description: "Call us directly",
      icon: Phone,
      color: "from-purple-400 to-violet-500",
      bg: "from-purple-50 to-violet-50",
      action: () => {
        window.open("tel:+1-800-MINDEASE", "_blank");
      },
      external: true
    },
    {
      id: "crisis",
      title: "Crisis Support",
      description: "24/7 emergency mental health support",
      icon: Heart,
      color: "from-red-400 to-pink-500",
      bg: "from-red-50 to-pink-50",
      action: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('open-crisis-resources'));
      }
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
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
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-2xl py-3"
              >
                Close
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Contact Support
                </h2>
                <p className="text-sm text-gray-600">We're here to help you</p>
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
          {!selectedMethod ? (
            <>
              {/* Contact Methods */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose how you'd like to contact us</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`bg-gradient-to-br ${method.bg} border-2 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
                        onClick={method.action}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                            >
                              <method.icon className="w-6 h-6 text-white" />
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{method.title}</h4>
                                {method.external && (
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Support Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Hours</h4>
                    <p className="text-sm text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Email: 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Chat: 9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Crisis: 24/7</span>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            /* Email Form */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMethod(null)}
                  className="rounded-full p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold text-gray-800">Send us a message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                      className="rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className="rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your issue"
                    className="rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                    Priority
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                    className="w-full rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 p-3"
                  >
                    <option value="low">Low - General question</option>
                    <option value="normal">Normal - Feature request</option>
                    <option value="high">High - Bug report</option>
                    <option value="urgent">Urgent - Account issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your issue or question in detail..."
                    rows={6}
                    className="rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-2xl py-3 font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 