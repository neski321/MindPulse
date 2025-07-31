import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, FileText, AlertTriangle, Shield, Heart, Users, Globe, Scale } from "lucide-react";

interface TermsConditionsProps {
  onClose: () => void;
}

export function TermsConditions({ onClose }: TermsConditionsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
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
                  <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Terms & Conditions
                  </h2>
                  <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
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
          <div 
            ref={contentRef}
            className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-6 text-gray-700">
              
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-green-500" />
                  Agreement to Terms
                </h3>
                <p className="leading-relaxed">
                  By accessing and using MindPulse ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              {/* Service Description */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-500" />
                  Service Description
                </h3>
                <p className="leading-relaxed mb-3">
                  MindPulse is a mental wellness application that provides:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Mood tracking and mental health assessments</li>
                  <li>Wellness tools and meditation exercises</li>
                  <li>Progress monitoring and insights</li>
                  <li>Community support features</li>
                  <li>Educational resources and crisis support</li>
                </ul>
              </section>

              {/* Medical Disclaimer */}
              <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Medical Disclaimer
                </h3>
                <p className="leading-relaxed mb-3 text-sm">
                  <strong>Important:</strong> MindPulse is not a substitute for professional medical advice, diagnosis, or treatment. 
                  The information provided through our app is for educational and self-help purposes only.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Always consult with qualified healthcare professionals for medical concerns</li>
                  <li>In case of emergency, contact emergency services immediately</li>
                  <li>Our app does not provide medical diagnosis or treatment</li>
                  <li>Use our tools as complementary to professional care</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  User Accounts
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Account Creation</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You must provide accurate and complete information</li>
                      <li>You are responsible for maintaining account security</li>
                      <li>You must be at least 13 years old to create an account</li>
                      <li>One account per person is allowed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Account Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Keep your login credentials secure</li>
                      <li>Notify us immediately of any unauthorized access</li>
                      <li>You are responsible for all activity under your account</li>
                      <li>Do not share your account with others</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Acceptable Use */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Acceptable Use</h3>
                <p className="leading-relaxed mb-3">
                  You agree to use MindPulse only for lawful purposes and in accordance with these Terms.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ You May:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Use the app for personal wellness</li>
                      <li>• Share positive experiences</li>
                      <li>• Provide constructive feedback</li>
                      <li>• Report bugs or issues</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">❌ You May Not:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Harm yourself or others</li>
                      <li>• Share harmful content</li>
                      <li>• Attempt to hack or disrupt the service</li>
                      <li>• Use the app for commercial purposes</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy and Data */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Privacy and Data Protection
                </h3>
                <p className="leading-relaxed mb-3">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>We collect data to provide and improve our services</li>
                  <li>Your mental health data is treated with utmost confidentiality</li>
                  <li>We implement appropriate security measures</li>
                  <li>You control your data and can request deletion</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intellectual Property</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Our Rights</h4>
                    <p className="text-sm">
                      MindPulse and its content, features, and functionality are owned by MindPulse Inc. and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Your Rights</h4>
                    <p className="text-sm">
                      You retain ownership of your personal data and content you create within the app. You grant us a license to use your data to provide our services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Disclaimers */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Disclaimers</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Service Availability</h4>
                    <p className="text-sm">
                      We strive to provide reliable service but cannot guarantee uninterrupted access. We may modify, suspend, or discontinue the service at any time.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">No Warranty</h4>
                    <p className="text-sm">
                      The app is provided "as is" without warranties of any kind. We do not guarantee that the app will meet your specific requirements or be error-free.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  To the maximum extent permitted by law, MindPulse Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the app.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Termination</h3>
                <div className="space-y-3">
                  <p className="text-sm">
                    <strong>You may terminate your account</strong> at any time by deleting your account through the app settings.
                  </p>
                  <p className="text-sm">
                    <strong>We may terminate your access</strong> if you violate these Terms or for any other reason at our discretion.
                  </p>
                  <p className="text-sm">
                    <strong>Upon termination:</strong> Your account will be deactivated and your data may be deleted according to our data retention policy.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-500" />
                  Governing Law
                </h3>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United States. 
                  Any disputes arising from these Terms or your use of the app shall be resolved in the courts of the United States.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Changes to Terms</h3>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes through the app or email. 
                  Continued use of the app after changes constitutes acceptance of the new Terms.
                </p>
              </section>

                             {/* Contact Information */}
               <section className="bg-gray-50 p-4 rounded-lg">
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h3>
                 <p className="leading-relaxed mb-3">
                   If you have any questions about these Terms & Conditions, please contact us:
                 </p>
                 <div className="space-y-2 text-sm">
                   <p><strong>Email:</strong> legal@mindpulse.app</p>
                   <p><strong>Support:</strong> support@mindpulse.app</p>
                   <p><strong>Address:</strong> MindPulse Inc., [Address]</p>
                 </div>
               </section>

               {/* Close Button */}
               <div className="flex justify-center pt-6">
                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                   <Button
                     onClick={onClose}
                     className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-2xl px-8 py-3 font-medium shadow-lg transition-all duration-300"
                   >
                     Close
                   </Button>
                 </motion.div>
               </div>
             </div>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 